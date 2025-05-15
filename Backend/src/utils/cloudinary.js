import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = (fileBuffer, localFilePath) => {
  return new Promise((resolve, reject) => {
    if (!localFilePath) return null;

    const stream = cloudinary.uploader.upload_stream({
      localFilePath,
      resource_type: "auto",
    });

    (error, result) => {
      if (error) return reject(error);
      resolve(result?.secure_url);
    };
    streamifier.createReadStream(fileBuffer.buffer).pipe(stream);
  });
};
