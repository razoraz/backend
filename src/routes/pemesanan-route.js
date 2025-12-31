import express from 'express';
import { ambilMejaById, ambilSemuaMetodePembayaran, tambahPemesananLengkap, getStatusPembayaran, getDetailStruk getListPemesanan, hapusPemesanan, updatePemesanan } from '../controllers/pemesanan.js';
import { simulatePaymentSuccess } from '../controllers/tes.js';
import { getDetailPemesanan } from '../controllers/pemesanan.js';

const router = express.Router();

// ✅ ROUTE KHUSUS HARUS DULU (SEBELUM PARAMETER)
router.get('/metode-pembayaran', ambilSemuaMetodePembayaran);

// ✅ ROUTE LAINNYA
router.get('/list-pemesanan', getListPemesanan);
router.post('/add-pemesanan', tambahPemesananLengkap);
router.post('/simulate-payment', simulatePaymentSuccess);
router.get('/status/:orderId', getStatusPembayaran);
router.get('/detail/:id_pemesanan', getDetailStruk);
router.put('/update-pemesanan/:id_pemesanan', updatePemesanan);
router.delete('/delete-pemesanan/:id_pemesanan', hapusPemesanan);
router.get('/detail-pemesanan/:id_pemesanan', getDetailPemesanan);

// ✅ ROUTE DENGAN PARAMETER HARUS TERAKHIR
router.get('/:id', ambilMejaById);


export default router;
