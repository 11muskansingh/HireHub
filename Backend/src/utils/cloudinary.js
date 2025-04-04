//We will assume that the files are already stored temporarily on our server. We are following the next steps.

import cloudinaryPkg from "cloudinary"; // Import the default export
const { v2: cloudinary } = cloudinaryPkg; // Destructure v2

import fs from "fs"; // File system

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary = async (files) => {
  try {
    if (!files || !Array.isArray(files)) return [];

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const resourceType = file.mimetype.startsWith("image")
          ? "image"
          : "raw";

        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType, public_id: file.originalname },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const responses = await Promise.all(uploadPromises);
    console.log("Files uploaded successfully:", responses);

    return responses.length === 1 ? responses[0] : responses; // Return URLs of all uploaded files
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    return null;
  }
};

export { uploadonCloudinary };
