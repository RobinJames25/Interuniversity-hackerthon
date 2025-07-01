import { Router } from "express";
import multer from 'multer';
import { uploadAudio } from "../controllers/upload.controller.js";

const router = Router();
const upload = multer({ dest: 'tmp/' });

router.post('/audio', upload.single('file'), uploadAudio);
export default router;