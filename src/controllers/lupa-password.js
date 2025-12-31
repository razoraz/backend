import AdminModel from '../models/admin.js';
import jwt from 'jsonwebtoken';

export const verifyAdminForReset = async (req, res) => {
  try {
    const { email, kode_admin } = req.body;
    // =======================
    // ✅ Validasi Input
    // =======================
    if (!email || !kode_admin) {
      return res.status(400).json({ message: 'Data wajib diisi' });
    }
    const admin = await AdminModel.findByEmailAndKode(email, kode_admin);
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Email atau kode admin salah' });
    }

    // =======================
    // 🎫 Generate Reset Token
    // =======================
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

    res.json({ success: true, resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
