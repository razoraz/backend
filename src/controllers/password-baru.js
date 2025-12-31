import AdminModel from '../models/admin.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword, resetToken } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Password tidak cocok' });
  }

  try {
    // =======================
    // 🔓 Verifikasi Reset Token
    // =======================
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const email = decoded.email;

    const hashed = await bcrypt.hash(newPassword, 10);
    const success = await AdminModel.updatePassword(email, hashed);

    if (!success) {
      return res.status(400).json({ success: false, message: 'Email tidak ditemukan' });
    }

    res.json({ success: true, message: 'Password berhasil diupdate' });
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Reset token kadaluarsa, ulangi proses lupa password' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
