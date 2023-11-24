import express from 'express';
import multer from 'multer';
import { uploadFile, getUsers } from '../controllers/files.controller';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/files', upload.single('file'), uploadFile);
router.get('/api/users', getUsers);

export default router;
