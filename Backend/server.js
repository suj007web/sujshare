import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import fileRoutes from './routes/file.route.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = path.join(__dirname, '..', 'Frontend', 'dist')

app.use(express.static(staticDir))
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}));

app.use('/api', fileRoutes);

app.get('*', (req, res, next) => {
  return res.sendFile(path.join(staticDir, 'index.html'))
});
console.log(staticDir);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});