import express from 'express';
import { downloadLaporanPemesanan, downloadLaporanReservasi } from '../controllers/laporan.js';
const router = express.Router();

router.get('/pemesanan/:range', downloadLaporanPemesanan);
router.get('/reservasi/:range', downloadLaporanReservasi);

export default router;
