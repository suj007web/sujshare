import File from "../models/file.model.js";
import QRCode from "qrcode";
import cloudinary from "cloudinary";
import { getDataUri } from "../middlewares/datauri.middleware.js";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File Handler
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;

    // Check if a file was uploaded
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Convert file to a data URI
    const fileUri = getDataUri(file);

    // Upload file to Cloudinary with resource_type 'auto' to support any file type
    const cloudinaryResult = await cloudinary.v2.uploader.upload(
      fileUri.content,
      { resource_type: "auto" }  // Handles all file types (image, video, document, etc.)
    );

    const file_url = cloudinaryResult.secure_url;
    const file_id = cloudinaryResult.public_id;

    // Save file details in the database
    const myfile = new File({
      filename: req.file.originalname,
      cloudinaryUrl: file_url,
      cloudinaryPublicId: file_id,
    });

    // Generate a download URL (your backend URL for file download)
    const downloadUrl = `${process.env.BACKEND_URL}/download/${myfile._id}`;

    // Generate a QR code that points to the download URL
    const qrCodeDataUrl = await QRCode.toDataURL(downloadUrl);
    myfile.qrCode = qrCodeDataUrl;

    // Save the file record with QR code in the database
    await myfile.save();

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      file: myfile,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    });
  }
};

// Download File Handler
export const downloadFile = async (req, res) => {
  try {
    // Find the file by its ID
    const file = await File.findById(req.params.id);

    // Check if the file exists in the database
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Redirect to the Cloudinary URL to trigger file download
    return res.redirect(file.cloudinaryUrl);

  } catch (error) {
    console.error("Error in downloadFile:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
