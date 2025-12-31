import express from 'express';
import multer from 'multer';
import {
  getAllEvent,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent
} from '../controllers/event.js';

const router = express.Router();

// Config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/event');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', getAllEvent);
router.get('/:id', getEventById);
router.post('/', upload.single('gambar_event'), addEvent);
router.put('/:id', upload.single('gambar_event'), updateEvent);
router.delete('/:id', deleteEvent);

export default router;
