import express from 'express';
import { login } from '../controllers/login.js';
import { verifyAdminForReset } from '../controllers/lupa-password.js';
import { resetPassword } from '../controllers/password-baru.js';

const router = express.Router();

// =======================
// 🛣️ ROUTES ADMIN
// =======================
router.post('/login', login);

// =======================
// 🔐 Lupa Password Admin
// =======================
router.post('/lupa-password/verify', verifyAdminForReset);

// =======================
// 🔄 Reset Password Admin
// =======================
router.post('/reset-password/reset', resetPassword);

export default router;
