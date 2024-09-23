import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import fileRoutes from './routes/file.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}));

app.use('/api', fileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});