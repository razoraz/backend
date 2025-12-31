import express from 'express';
import { addReservasiLengkap, getListReservasi, hapusReservasi, getDetailByReservasi, updateReservasi } from '../controllers/reservasi.js';

const router = express.Router();

router.post('/add-reservasi', addReservasiLengkap);
router.get('/list-reservasi', getListReservasi);
router.delete('/delete-reservasi/:id_reservasi', hapusReservasi);
router.get('/detail-reservasi/:id_reservasi', getDetailByReservasi);
router.put('/update-reservasi/:id_reservasi', updateReservasi);

export default router;
