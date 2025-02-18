//We will assume that the files are already stored temporarily on our server. We are following the next steps.

import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary = async (file) => {
  try {
    if (!file) return null;

    if (typeof file === "string") {
      // Handle URL
      const response = await axios({
        url: file,
        responseType: "stream",
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        response.data.pipe(uploadStream);
      });
    } else {
      // Handle file buffer
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", public_id: file.originalname },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });
    }
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

export { uploadonCloudinary };
