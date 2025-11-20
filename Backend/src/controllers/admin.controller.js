import User from "../models/user.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Vendor from "../models/vendor.model.js";
import { generateUrlToken, hashUrlToken } from "../utils/otp.js";
import OTP from "../models/otpCode.model.js";
import {
  approvalReminderEmail,
  accountApprovedEmail,
} from "../email/sendEmail.js";
import { getExpiryDate } from "../utils/otp.js";

export const sendApprovalReminder = async (user) => {
  const urlToken = generateUrlToken();
  const hashedUrlToken = hashUrlToken(urlToken);

  await OTP.findOneAndUpdate(
    { email: user.email, purpose: "signUp" },
    {
      code: hashedUrlToken,
      expiresAt: getExpiryDate("urlToken"),
    },
    { upsert: true, new: true }
  );

  const url = `${process.env.HOME_URL}/${urlToken}`;
  await approvalReminderEmail(user.fullName, user.email, url);
};

export const createAdmin = AsyncHandler(async (req, res) => {
  console.log(req.body);
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(409, "User already exists");
  }

  await User.create({
    fullName,
    email,
    password,
    role: "admin",
    isEmailVerified: true,
  });

  res.status(200).json(new ApiResponse(200, "Admin created successfully", {}));
});

export const approveVendorAccount = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // checking if vendor exist
  const vendor = await Vendor.findById(id).populate("user");
  if (!vendor) {
    throw new ApiError(404, "Vendor not found.");
  }

  // checking if account is created which is a must before vendor approval can be given
  const user = vendor.user;
  if (!user) {
    throw new ApiError(404, "User associated with vendor not found.");
  }

  // checking if user verified their email or not -> must be for vendor approval
  if (!user.isEmailVerified) {
    await sendApprovalReminder(user);

    throw new ApiError(
      400,
      "User email must be verified before vendor approval."
    );
  }

  // checking if their vendor status is already approved
  if (vendor.accountApproval.status === "approved") {
    throw new ApiError(400, "Vendor account is already approved.");
  }

  // Update vendor status and user role
  vendor.accountApproval.status = "approved";
  vendor.isApproved = true;
  await vendor.save();

  if (user.role !== "vendor") {
    user.role = "vendor";
    await user.save();
  }

  // Send approval email
  await accountApprovedEmail(user.fullName, user.email);

  return res.status(200).json(
    new ApiResponse(200, "Vendor approved successfully.", {
      id: vendor._id,
    })
  );
});

export const approveMultipleVendors = AsyncHandler(async (req, res) => {
  console.log("hello1");
  const { ids } = req.body;
  console.log("hello2");
  console.log("ids: ", ids);
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of vendor IDs.");
  }

  const results = [];

  for (const id of ids) {
    const vendor = await Vendor.findById(id).populate("user");

    if (!vendor) {
      results.push({ id, status: "failed", reason: "Vendor not found" });
      continue;
    }

    const user = vendor.user;
    if (!user) {
      results.push({ id, status: "failed", reason: "User not found" });
      continue;
    }

    if (!user.isEmailVerified) {
      await sendApprovalReminder(user);
      results.push({
        id,
        status: "skipped",
        reason: "User email not verified. Reminder sent.",
      });
      continue;
    }

    if (vendor.accountApproval.status === "approved") {
      results.push({ id, status: "skipped", reason: "Already approved" });
      continue;
    }

    vendor.accountApproval.status = "approved";
    vendor.isApproved = true;
    await vendor.save();

    if (user.role !== "vendor") {
      user.role = "vendor";
      await user.save();
    }

    await accountApprovedEmail(user.fullName, user.email);
    results.push({ id, status: "approved" });
  }

  return res.status(200).json(
    new ApiResponse(200, "Batch vendor approval processed.", {
      summary: results,
    })
  );
});

export const listAllVendors = AsyncHandler(async (req, res) => {
  const { type } = req.query;
  let filter = {};
  if (type === "pending" || type === "approved" || type === "rejected") {
    filter.accountApproval = {};
  }

  if (type === "pending") {
    filter.accountApproval.status = "pending";
  } else if (type === "approved") {
    filter.accountApproval.status = "approved";
  } else if (type === "rejected") {
    filter.accountApproval.status = "rejected";
  }

  const vendors = await Vendor.find(filter)
    .populate({
      path: "user",
      select: "-password -__v -refreshToken",
    })
    .select("-__v");

  if (!vendors || vendors.length <= 0) {
    throw new ApiError(404, "Vendor list is empty");
  }

  res.status(200).json(new ApiResponse(200, "Vendors found", vendors));
});
