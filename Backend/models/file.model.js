import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  qrCode: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('File', fileSchema);