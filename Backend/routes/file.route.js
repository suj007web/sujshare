import express from 'express';
import {  downloadFile, uploadImage } from '../controllers/file.controller.js';
import { singleUpload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route('/upload').post(singleUpload, uploadImage);
router.get('/download/:id', downloadFile);

export default router;