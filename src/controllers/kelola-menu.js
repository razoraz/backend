import { getAllKategori } from "../models/kategori_menu.js";
import {
  tambahMenu,
  getAllMenu,
  searchAndFilterMenu,
  hapusMenu,
  updateMenuById, 
  getMenuById, 
} from "../models/menu.js";

// =======================
// 🍽️ Ambil Semua Menu
// =======================
export const getMenu = (req, res) => {
  getAllMenu((err, result) => {
    if (err) {
      console.error("Error ambil menu:", err);
      return res.status(500).json({ message: "Gagal mengambil data menu", error: err });
    }
    res.json(result);
  });
};

// =======================
// 📦 Ambil Semua Kategori
// =======================
export const getKategori = (req, res) => {
  getAllKategori((err, result) => {
    if (err) return res.status(500).json({ message: "Gagal ambil kategori", error: err });
    res.json(result);
  });
};

// =======================
// 🍴 Tambah Menu Baru
// =======================
export const addMenu = (req, res) => {
  const { nama_menu, id_kategori, harga, deskripsi, status_tersedia } = req.body;
  const gambar_menu = req.file ? req.file.filename : null;

  if (!gambar_menu) return res.status(400).json({ message: "Gambar wajib diupload" });

  const data = { nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_menu };

  tambahMenu(data, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal menambahkan menu", error: err });
    }
    res.json({ message: "Menu berhasil ditambahkan!" });
  });
};

// =======================
// 🔍 Search & Filter Menu
// =======================
export const searchMenu = (req, res) => {
  const { keyword, kategori } = req.query;

  searchAndFilterMenu(keyword, kategori, (err, result) => {
    if (err) {
      console.error("Error search menu:", err);
      return res.status(500).json({ message: "Gagal mencari menu", error: err });
    }
    res.json(result);
  });
};

// =======================
// ❌ Hapus Menu
// =======================
export const deleteMenu = (req, res) => {
  const { id } = req.params;

  hapusMenu(id, (err) => {
    if (err) {
      console.error("Error hapus menu:", err);
      return res.status(500).json({ message: err.message || "Gagal menghapus menu" });
    }
    res.json({ message: "Menu berhasil dihapus!" });
  });
};

// =======================
// 🔎 Ambil Data Menu by ID (untuk form ubah)
// =======================
export const getMenuByIdController = (req, res) => {
  const { id } = req.params;
  getMenuById(id, (err, result) => {
    if (err) {
      console.error("Error get menu by id:", err);
      return res.status(500).json({ message: "Gagal ambil menu", error: err });
    }
    res.json(result[0]); 
  });
};

// =======================
// 🛠️ Update Menu
// =======================
export const updateMenu = (req, res) => {
  const { id } = req.params;
  const { nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_lama } = req.body;
  const gambar_menu = req.file ? req.file.filename : gambar_lama; 

  const data = { nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_menu };

  updateMenuById(id, data, (err) => {
    if (err) {
      console.error("❌ Gagal update menu:", err);
      return res.status(500).json({ message: "Gagal mengubah menu", error: err });
    }
    res.json({ message: "Menu berhasil diubah!" });
  });
};
