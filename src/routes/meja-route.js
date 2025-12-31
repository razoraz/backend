import express from 'express';
import mejaController from '../controllers/meja.js';

const router = express.Router();

// =======================
// 🛣️ ROUTES MEJA
// =======================

// semua meja
router.get('/', mejaController.getAll);

// route spesifik dulu
router.get('/qr/:no_meja', mejaController.generateQRCodeByNoMeja);
router.get('/form-pemesanan', mejaController.verifyToken);

// route dinamis /:id
router.get('/:id_meja', mejaController.getById);

// CRUD
router.post('/', mejaController.create);
router.put('/:id_meja', mejaController.update);
router.delete('/:id_meja', mejaController.delete);

export default router;
