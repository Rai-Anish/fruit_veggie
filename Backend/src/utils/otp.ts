import crypto from "crypto";

export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999);
  return otp.toString();
};

export const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const generateUrlToken = (size = 32) => {
  return crypto.randomBytes(size).toString("base64url");
};

export const hashUrlToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Verify OTP by comparing the input OTP with the stored hashed OTP
export const verifyOTP = (otp, hashedOtp) => {
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return hash === hashedOtp;
};

// Verify URL token by comparing the input token with the stored hashed URL token
export const verifyUrlToken = (token, hashedToken) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash === hashedToken;
};

// Function to calculate expiration date
export const getExpiryDate = (type = "otp") => {
  let expiryDate;

  // Set expiration for OTP (15 minutes) and URL Token (24 hours)
  if (type === "otp") {
    expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15); // 15 minutes expiry
  } else if (type === "urlToken") {
    expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // 1 hours expiry
  }

  return expiryDate;
};
