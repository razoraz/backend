import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import crypto from 'crypto';
import Meja from '../models/meja.js';

// =======================
// 🔐 Secret Key JWT
// =======================
const SECRET_KEY = 'BASECAMP_KOPI_01';

const mejaController = {
  // Mengambil semua data meja
  getAll: async (req, res) => {
    try {
      const mejaList = await Meja.getAll();
      res.json(mejaList);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mengambil data meja berdasarkan ID
  getById: async (req, res) => {
    try {
      const meja = await Meja.getById(req.params.id_meja);
      res.json(meja);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Membuat data meja baru
  create: async (req, res) => {
    try {
      const { no_meja, kapasitas } = req.body;

      const rnd = crypto.randomBytes(32).toString('hex');

      const token = jwt.sign({ meja: no_meja, rnd }, SECRET_KEY, { expiresIn: '365d' });

      const id_meja = await Meja.create({
        no_meja,
        kapasitas,
        status_meja: 'tersedia',
        token,
      });

      res.status(201).json({ id_meja, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Memperbarui data meja
  update: async (req, res) => {
    try {
      await Meja.update(req.params.id_meja, req.body);
      res.json({ message: 'Meja berhasil diperbarui' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Menghapus data meja
  delete: async (req, res) => {
    try {
      await Meja.delete(req.params.id_meja);
      res.json({ message: 'Meja berhasil dihapus' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Generate QR Code
  generateQRCodeByNoMeja: async (req, res) => {
    try {
      const { no_meja } = req.params;

      const meja = await Meja.getByNo(no_meja);
      if (!meja) return res.status(404).json({ error: 'Meja tidak ditemukan' });

      // ambil URL dari env
      const FRONTEND_URL = process.env.VITE_FRONTEND_URL || 'https://frontend-basecamp.vercel.app';

      // URL lengkap beserta token
      const url = `${FRONTEND_URL}/form-pemesanan?token=${meja.token}`;

      // generate QR
      const qrImage = await QRCode.toDataURL(url);

      res.json({
        meja: meja.no_meja,
        token: meja.token,
        url,
        qrImage,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Verifikasi Token Meja
  verifyToken: async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: 'Token kosong' });

    try {
      const decoded = jwt.verify(token, SECRET_KEY); // decode token
      const meja = await Meja.getAll();
      const mejaData = meja.find((m) => m.no_meja == decoded.meja);
      if (!mejaData) return res.status(404).json({ error: 'Meja tidak ditemukan' });

      res.json({ meja: mejaData.no_meja });
    } catch (err) {
      res.status(401).json({ error: 'Token invalid atau kadaluarsa' });
    }
  },
};

export default mejaController;
