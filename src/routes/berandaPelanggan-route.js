import express from 'express';
import {
  getMenuTerlaris,
  getFeedback,
  getEventPromo
} from '../controllers/beranda-pelanggan.js';

const router = express.Router();

router.get('/menu-terlaris', getMenuTerlaris);
router.get('/feedback', getFeedback);
router.get('/event', getEventPromo);

export default router;
