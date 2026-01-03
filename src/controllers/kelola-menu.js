import cloudinary from '../config/cloudinary.js';
import { getAllKategori } from '../models/kategori_menu.js';
import { tambahMenu, getAllMenu, searchAndFilterMenu, hapusMenu, updateMenuById, getMenuById } from '../models/menu.js';

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
// ➕ Tambah Menu
// =======================
export const addMenu = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Gambar wajib diupload' });
    }
    
    const data = {
      ...req.body,
      gambar_menu: upload.secure_url,
      public_id: upload.public_id,
    };

    tambahMenu(data, (err) => {
      if (err) throw err;
      res.json({ message: 'Menu berhasil ditambahkan' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload gagal', error: err });
  }
};

// =======================
// ❌ Hapus Menu
// =======================
export const deleteMenu = (req, res) => {
  const { id } = req.params;

  getMenuById(id, async (err, result) => {
    if (err || !result.length) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    const { public_id } = result[0];

    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }

    hapusMenu(id, (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: 'Menu berhasil dihapus' });
    });
  });
};

// =======================
// 🛠️ Update Menu
// =======================
export const updateMenu = async (req, res) => {
  const { id } = req.params;

  getMenuById(id, async (err, result) => {
    if (err || !result.length) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    let gambar_menu = null;
    let public_id = null;

    if (req.file) {
      // Hapus gambar lama pakai public_id dari DB
      if (result[0].public_id) {
        await cloudinary.uploader.destroy(result[0].public_id);
      }

      // Ambil hasil upload dari middleware (JANGAN upload lagi)
      gambar_menu = req.secure_url;
      public_id = req.file.public_id;
    }

    updateMenuById(
      id,
      {
        ...req.body,
        gambar_menu,
        public_id,
      },
      (err2) => {
        if (err2) return res.status(500).json(err2);
        res.json({ message: 'Menu berhasil diupdate' });
      }
    );
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
