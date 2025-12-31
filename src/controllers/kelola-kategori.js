import { addKategori, deleteKategori, updateKategori } from '../models/kategori_menu.js';

// =======================
//  ➕ Tambah Kategori
// =======================
export const tambahKategori = (req, res) => {
  const { nama_kategori } = req.body;
  addKategori({ nama_kategori }, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menambahkan kategori', error: err });
    res.json({ message: 'Kategori berhasil ditambahkan!' });
  });
};

// =======================
// 🗑️ Hapus Kategori
// =======================
export const hapusKategori = (req, res) => {
  const { id_kategori } = req.params;
  deleteKategori(id_kategori, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus kategori', error: err });
    res.json({ message: 'Kategori berhasil dihapus!' });
  });
};

// =======================
// ✏️ Perbarui Kategori
// =======================
export const perbaruiKategori = (req, res) => {
  const { id_kategori } = req.params;
  const { nama_kategori } = req.body;
  updateKategori(id_kategori, { nama_kategori }, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal memperbarui kategori', error: err });
    res.json({ message: 'Kategori berhasil diperbarui!' });
  });
};
