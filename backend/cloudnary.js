import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(imagePath, imageName) {
  try {
    // Upload
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: imageName,
    });
    const imageUrl = uploadResult.secure_url;
    console.log("Upload success:", imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export { uploadToCloudinary };