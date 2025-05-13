import User from "../models/user.model.js";
import OTP from "../models/otpCode.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendVerificationEmail } from "../email/sendEmail.js";
import jwt from "jsonwebtoken";
import {
  generateUrlToken,
  getExpiryDate,
  hashUrlToken,
  verifyUrlToken,
} from "../utils/otp.js";
import { refreshAndAccessCookieOption } from "../utils/cookieOption.js";
import { genrateAccessAndRefreshToken } from "../utils/refreshAndAccessToken.js";

export const signUp = AsyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(409, "User already exists");
  }

  const newUser = new User({
    fullName,
    email,
    password,
  });
  await newUser.save();

  const urlToken = generateUrlToken();
  const hashedUrlToken = hashUrlToken(urlToken);

  const otp = await OTP.create({
    code: hashedUrlToken,
    expiresAt: getExpiryDate("urlToken"),
    purpose: "signUp",
    email: email,
  });

  // send email verification code
  const url = `${process.env.HOME_URL}/${urlToken}`;
  const emailSend = sendVerificationEmail(email, fullName, url);
  // create temporary jtw token
  const signUpToken = jwt.sign(
    {
      email: newUser.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res
    .status(200)
    .cookie("signUpToken", signUpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    }) // 1 hour in milliseconds
    .json(
      new ApiResponse(
        201,
        "Verification email has been send, please verify your account",
        { signUpToken }
      )
    );
});

export const resendVerifyEmail = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please enter your email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Your email is already verified");
  }

  const urlToken = generateUrlToken();
  const hashedUrlToken = hashUrlToken(urlToken);

  const otp = await OTP.findOneAndUpdate(
    { email: email, purpose: "signUp" },
    {
      code: hashedUrlToken,
      expiresAt: getExpiryDate("urlToken"),
    },
    { upsert: true, new: true } // creates if not exists
  );

  const url = `${process.env.HOME_URL}/${urlToken}`;
  await sendVerificationEmail(user.email, user.fullName, url);

  // Optionally refresh the signUpToken cookie if needed
  const signUpToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res
    .status(200)
    .cookie("signUpToken", signUpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    })
    .json(new ApiResponse(200, "New verification email sent", { signUpToken }));
});

export const verifyEmail = AsyncHandler(async (req, res) => {
  const urlToken = req.params.urlToken;
  const token = req.cookies.signUpToken || req.body.signUpToken;

  if (!urlToken) {
    throw new ApiError(401, "No url token provided");
  }

  if (!token) {
    throw new ApiError(
      400,
      "Cookies is not set. Try sending email verification code again"
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userExist = await User.findOne({ email: decoded.email });

  if (!userExist) {
    throw new ApiError(404, "User doesn't exit");
  }

  if (userExist.isEmailVerified) {
    throw new ApiError(400, "Your account is already verified");
  }

  const urlTokenExist = await OTP.findOne({
    email: decoded.email,
    purpose: "signUp",
  });

  if (!urlTokenExist) {
    throw new ApiError(400, "Make sure you entered correct credentials");
  }

  if (urlTokenExist.expiresAt < new Date()) {
    throw new ApiError(
      400,
      "Your token has expired. Try getting new verification code"
    );
  }

  const checkUrlToken = verifyUrlToken(urlToken, urlTokenExist.code);

  if (!checkUrlToken) {
    throw new ApiError(
      400,
      "Your url token didn't match. Try sending verification code again"
    );
  }

  userExist.isEmailVerified = true;
  userExist.lastLogin = new Date();
  await userExist.save({ validateBeforeSave: false });

  const { refreshToken, accessToken } = await genrateAccessAndRefreshToken(
    userExist._id
  );

  await OTP.findByIdAndDelete(urlTokenExist._id);

  const user = await User.findById(userExist._id).select("_id");

  const { refreshOption, accessOption } = refreshAndAccessCookieOption();
  res
    .status(200)
    .clearCookie("signUpToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    })
    .cookie("refreshToken", refreshToken, refreshOption)
    .cookie("accessToken", accessToken, accessOption)
    .json(
      new ApiResponse(200, "Account verified successfully", {
        user,
        refreshToken,
        accessToken,
      })
    );
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please enter your email and password");
  }

  const userExist = await User.findOne({ email });

  if (!userExist) {
    throw new ApiError(404, "User doesn't exist");
  }

  const verifyPassword = await userExist.checkPassword(password);
  console.log("verifyPassword: ", verifyPassword);

  if (!verifyPassword) {
    throw new ApiError(400, "Please enter correct credentials");
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    userExist._id
  );

  userExist.refreshToken = refreshToken;
  userExist.lastLogin = new Date();
  userExist.save({ validateBeforeSave: false });

  const { _id, email: userEmail, fullName, role, lastLogin } = userExist || {};
  const user = { _id, email: userEmail, fullName, role, lastLogin };

  const { refreshOption, accessOption } = refreshAndAccessCookieOption();

  res
    .status(200)
    .cookie("refreshToken", refreshToken, refreshOption)
    .cookie("accessToken", accessToken, accessOption)
    .json(
      new ApiResponse(201, "Login successfully", {
        user,
        refreshToken,
        accessToken,
      })
    );
});

export const logout = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const { accessOption, refreshOption } = refreshAndAccessCookieOption();
  res
    .status(200)
    .clearCookie("accessToken", accessOption)
    .clearCookie("refreshToken", refreshOption)
    .json(new ApiResponse(200, "User logout successfully", {}));
});

export const getNewAccessToken = AsyncHandler(async (req, res) => {
  // Get the refresh token from cookies or headers
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    throw new ApiError(400, "Unauthorized access");
  }

  // Verify the refresh token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // Find the user with the decoded ID
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, "Invalid or expired refresh token");
  }
  console.log("Incoming refresh token:", token);
  console.log("Database refresh token:", user.refreshToken);
  console.log(`User: ${user}`);
  if (token !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  // Generate new access and refresh tokens
  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    user._id
  );

  // Set cookie options
  const { refreshOption, accessOption } = refreshAndAccessCookieOption();

  // Send response with new tokens
  res
    .status(200)
    .clearCookie("refreshToken", refreshOption)
    .clearCookie("accessToken", accessOption)
    .cookie("refreshToken", refreshToken, refreshOption)
    .cookie("accessToken", accessToken, accessOption)
    .json(
      new ApiResponse(200, "Access token created successfully", {
        refreshToken,
        accessToken,
      })
    );
});
