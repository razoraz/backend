import express from 'express';
import upload from "../middlewares/uploadLocalOrMulter.js"; // bisa multer local atau cloudinary
import {
  getAllEvent,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.js';

const router = express.Router();

router.get('/', getAllEvent);
router.get('/:id', getEventById);
router.post('/', upload.single('gambar_event'), addEvent);
router.put('/:id', upload.single('gambar_event'), updateEvent);
router.delete('/:id', deleteEvent);

export default router;
