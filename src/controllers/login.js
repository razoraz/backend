import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =======================
    // 🔐 Validasi Input
    // =======================
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    // =========================
    // 👤 Cek Admin di Database
    // =========================
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: 'Email tidak ditemukan' });
    }

    // =========================
    // 🔒 Validasi Password
    // =========================
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // =========================
    // 🎟️ Generate JWT Token
    // =========================
    const token = jwt.sign({ id_admin: admin.id_admin, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login berhasil',
      token,
      id_admin: admin.id_admin,
      email: admin.email, 
      kode_admin: admin.kode_admin, 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
