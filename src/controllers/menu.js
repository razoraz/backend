import { getAllKategori } from '../models/kategori_menu.js';
import { getAllMenu, searchAndFilterMenu, getMenuById } from '../models/menu.js';

// =======================
// 🍽️ Ambil Semua Menu
// =======================
export const getMenu = (req, res) => {
  getAllMenu((err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
// =======================
// 📦 Ambil Semua Kategori
// =======================
export const getKategori = (req, res) => {
  getAllKategori((err, result) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil kategori', error: err });
    res.json(result);
  });
};

// =======================
// 🔎 Menu by ID
// =======================
export const getMenuByIdController = (req, res) => {
  getMenuById(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// =======================
// 🔍 Search
// =======================
export const searchMenu = (req, res) => {
  searchAndFilterMenu(req.query.keyword, req.query.kategori, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};
