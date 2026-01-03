import express from 'express';
import upload from "../middlewares/uploadCloudinary.js";
import {
  getAllEvent,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.js';

const router = express.Router();

// Routes
router.get('/', getAllEvent);
router.get('/:id', getEventById);
router.post('/', upload.single('gambar_event'), addEvent);
router.put('/:id', upload.single('gambar_event'), updateEvent);
router.delete('/:id', deleteEvent);

export default router;
