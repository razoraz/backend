import express from 'express';
import {
  getBerandaSummary,
  getBerandaNotifications
} from '../controllers/beranda.js';

const router = express.Router();

router.get('/summary', getBerandaSummary);
router.get('/notifications', getBerandaNotifications);

export default router;
