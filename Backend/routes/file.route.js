import express from 'express';
import {  downloadFile, uploadFile} from '../controllers/file.controller.js';
import { singleUpload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route('/upload').post(singleUpload, uploadFile);
router.get('/download/:id', downloadFile);

export default router;