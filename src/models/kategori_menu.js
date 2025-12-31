import db from "../config/db.js";

// =========================
// 📋 Ambil Semua Kategori
// =========================
export const getAllKategori = (callback) => {
  const sql = "SELECT * FROM kategori_menu ORDER BY nama_kategori ASC";
  db.query(sql, callback);
};

// =========================
// 🔍 Ambil Kategori Berdasarkan ID
// =========================
export const getKategoriById = (id_kategori, callback) => {
  const sql = "SELECT * FROM kategori_menu WHERE id_kategori = ?";
  db.query(sql, [id_kategori], callback);
};

// =========================
// ➕ Tambah Kategori Baru
// =========================
export const addKategori = (data, callback) => {
  const sql = "INSERT INTO kategori_menu (nama_kategori) VALUES (?)";
  db.query(sql, [data.nama_kategori], callback);
};

// =========================
// ✏️ Perbarui Kategori
// =========================
export const updateKategori = (id_kategori, data, callback) => {
  const sql = "UPDATE kategori_menu SET nama_kategori = ? WHERE id_kategori = ?";
  db.query(sql, [data.nama_kategori, id_kategori], callback);
};
// =========================
// ❌ Hapus Kategori
// =========================
export const deleteKategori = (id_kategori, callback) => {
  const sql = "DELETE FROM kategori_menu WHERE id_kategori = ?";
  db.query(sql, [id_kategori], callback);
};