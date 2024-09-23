import File from "../models/file.model.js";
import QRCode from "qrcode";
import cloudinary from "cloudinary";
import { getDataUri } from "../middlewares/datauri.middleware.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const fileUri = getDataUri(file);
    const cloudinaryResult = await cloudinary.v2.uploader.upload(
      fileUri.content
    );
    const image_url = cloudinaryResult.secure_url;
    const image_id = cloudinaryResult.public_id;
    
    const myfile = new File({
        filename: req.file.originalname,
        cloudinaryUrl: image_url,
        cloudinaryPublicId: image_id,
    });

    // const downloadUrl = `${process.env.BACKEND_URL}/download/${myfile._id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(image_url);
    myfile.qrCode = qrCodeDataUrl;

    await myfile.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      file: myfile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error,
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    res.redirect(file.file.cloudinaryUrl);
  } catch (error) {
    console.error("Error in downloadFile:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
