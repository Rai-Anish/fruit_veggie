import jwt from "jsonwebtoken";
import { sendPasswordResetEmail } from "../email/sendEmail.js";
import OTP from "../models/otpCode.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import {
  generateOTP,
  getExpiryDate,
  hashOTP,
  verifyOTP,
} from "../utils/otp.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "fullName email role lastLogin avatar"
  );

  if (!user) {
    throw new ApiError(404, " User not found");
  }

  res.status(200).json(new ApiResponse(200, "User found", { user }));
});

export const forgotPassword = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  // check if email is provided
  if (!email) {
    throw new ApiError(400, "Please enter your email");
  }

  // check if user exist with that email
  const userExist = await User.findOne({ email });

  if (!userExist) {
    throw new ApiError(404, "User doesn't exist");
  }

  // create an otp code
  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);

  //create new otp if doesnt exist or replace old otp
  await OTP.findOneAndUpdate(
    { email, purpose: "passwordReset" },
    {
      code: hashedOtp,
      expiresAt: getExpiryDate("otp"),
    },
    { upsert: true, new: true }
  );

  // send otp code from email
  sendPasswordResetEmail(email, userExist.fullName, otp);

  // 🔐 Create a secure identifier
  const token = jwt.sign({ email }, process.env.PASSWORD_RESET_SECRET, {
    expiresIn: "15m",
  });

  //return jwt containting email
  res.status(200).json(
    new ApiResponse(201, "Password reset code has been sent to your email", {
      token,
    })
  );
});

export const resetPassword = AsyncHandler(async (req, res) => {
  const token = req.query?.pr || req.body.token;
  const { otpCode, password } = req.body;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  if (!otpCode) {
    throw new ApiError(400, "Please enter the code");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET);
  } catch {
    throw new ApiError(500, "Invalid or Expired token");
  }

  const codeExist = await OTP.findOne({
    email: decoded.email,
    purpose: "passwordReset",
  });

  if (!codeExist || codeExist.expiresAt < new Date()) {
    throw new ApiError(400, "Either code doesn't exist or it has expired");
  }

  const verifyOtpCode = verifyOTP(otpCode, codeExist.code);

  if (!verifyOtpCode) {
    throw new ApiError(400, "Otp code didn't match");
  }

  const userExist = await User.findOne({ email: decoded.email });

  if (!userExist) {
    throw new ApiError(404, "User not found");
  }

  userExist.password = password;
  await userExist.save({ validateBeforeSave: false });

  await OTP.deleteOne({ email: decoded.email, purpose: "passwordReset" });

  res.status(200).json(new ApiResponse(201, "Password reset successfully"));
});

export const updateProfile = AsyncHandler(async (req, res) => {
  const { fullName = null, email = null } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        ...(fullName && { fullName: fullName }),
        ...(email && { email: email }),
      },
    },
    { new: true } // return the updated document
  ).select("_id fullName email role lastLogin");

  res.status(200).json(
    new ApiResponse(200, "Account details updated successfully", {
      updatedUser,
    })
  );
});

export const updateAvatar = AsyncHandler(async (req, res) => {
  const avatarPath = req.file?.path;

  if (!avatarPath) {
    throw new ApiError(400, "Avatar file path is missing");
  }

  const cloudinaryResponse = await uploadOnCloudinary(avatarPath);

  if (!cloudinaryResponse) {
    throw new ApiError(500, "Error occurred while uploading the picture");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: cloudinaryResponse.url,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Upload successful", { avatarUrl: user.avatar })
    );
});
