import User from "../models/user.model.js";
import Vendor from "../models/vendor.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { accountReviewEmail } from "../email/sendEmail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { vendorSchema } from "../schema/vendor.schema.js";

export const signUp = AsyncHandler(async (req, res) => {
  const avatarPath = req.files?.avatar?.[0]?.path;
  const storeLogoPath = req.files?.storeLogo?.[0]?.path;
  const idDocumentPath = req.files?.idDocument?.[0]?.path;

  const parsed = vendorSchema.safeParse(req.body);

  if (!parsed.success) {
    console.log("error: ", parsed.error.flatten());
    throw new ApiError(400, "Invalid data");
  }

  if (!storeLogoPath || !idDocumentPath) {
    throw new ApiError(400, "Store logo and id document both are required");
  }

  if (!avatarPath) {
    throw new ApiError(400, "Avatar picture is required.");
  }

  const { fullName, email, password, storeName, contactNumber, address } =
    req.body;

  let parsedAddress;
  try {
    parsedAddress = JSON.parse(address);
  } catch {
    throw new ApiError(400, "Invalid address format. Must be a JSON object.");
  }

  // Check if a user already exists with the provided email
  const userExist = await User.findOne({ email });

  if (userExist) {
    // Check if that user already has a vendor account
    const vendorExist = await Vendor.findOne({ user: userExist._id });

    if (vendorExist) {
      throw new ApiError(400, "A vendor account already exists for this user.");
    }

    // if user didnt upload avatar when they signed in.
    const avatar = await uploadOnCloudinary(avatarPath);
    await User.findByIdAndUpdate(userExist._id, {
      $set: {
        avatar: avatar.url,
      },
    });

    // uploading picture on cloudinary
    const storeLogoUrl = await uploadOnCloudinary(storeLogoPath);
    const idDocumentUrl = await uploadOnCloudinary(idDocumentPath);

    if (!storeLogoPath || !idDocumentPath) {
      throw new ApiError(500, "Error occurred while uploading the picture");
    }

    // User exists, but no vendor account -> create vendor
    const vendor = await Vendor.create({
      user: userExist._id,
      storeName,
      storeLogo: storeLogoUrl?.url,
      contactNumber,
      address: parsedAddress,
      idDocument: idDocumentUrl?.url,
      accountApproval: { status: "pending" },
    });

    // send account under review email
    accountReviewEmail(userExist.fullName, userExist.email);

    return res.status(201).json(
      new ApiResponse(
        201,
        "Vendor account created successfully. Your account is under review.",
        {
          vendorId: vendor._id,
        }
      )
    );
  }

  // uploading picture on cloudinary
  const storeLogoUrl = await uploadOnCloudinary(storeLogoPath);
  const idDocumentUrl = await uploadOnCloudinary(idDocumentPath);
  const avatarUrl = await uploadOnCloudinary(avatarPath);

  // If user does not exist, create both user and vendor
  const newUser = await User.create({
    fullName,
    email,
    password,
    avatar: avatarUrl?.url,
    role: "customer",
  });

  const newVendor = await Vendor.create({
    user: newUser._id,
    storeName,
    storeLogo: storeLogoUrl?.url,
    contactNumber,
    address: parsedAddress,
    idDocument: idDocumentUrl?.url,
    accountApproval: { status: "pending" },
  });

  // send account under review email
  return res.status(201).json(
    new ApiResponse(
      201,
      "Account created successfully. Your account is under review.",
      {
        userId: newUser._id,
        vendorId: newVendor._id,
      }
    )
  );
});
