import db from "../config/db.js";

// =========================
// 📋 Ambil Semua Menu
// =========================
export const getAllMenu = (callback) => {
  const sql = `
    SELECT m.*, k.nama_kategori
    FROM menu m
    JOIN kategori_menu k ON m.id_kategori = k.id_kategori
    ORDER BY m.id_menu DESC
  `;
  db.query(sql, callback);
};

// =========================
// 🔍 Ambil Menu Berdasarkan ID
// =========================
export const getMenuById = (id_menu, callback) => {
  const sql = `
    SELECT * FROM menu WHERE id_menu = ?
  `;
  db.query(sql, [id_menu], callback);
};

// =========================
// ➕ Tambah Menu
// =========================
export const tambahMenu = (data, callback) => {
  const sql = `
    INSERT INTO menu
    (nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_menu, public_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    data.nama_menu,
    data.id_kategori,
    data.harga,
    data.deskripsi,
    data.status_tersedia,
    data.gambar_menu,
    data.public_id,
  ], callback);
};

// =========================
// 🔍 Search & Filter
// =========================
export const searchAndFilterMenu = (keyword, kategori, callback) => {
  let sql = `
    SELECT m.*, k.nama_kategori
    FROM menu m
    JOIN kategori_menu k ON m.id_kategori = k.id_kategori
    WHERE 1=1
  `;
  const params = [];

  if (keyword) {
    sql += " AND m.nama_menu LIKE ?";
    params.push(`%${keyword}%`);
  }

  if (kategori) {
    sql += " AND m.id_kategori = ?";
    params.push(kategori);
  }

  db.query(sql, params, callback);
};

// =========================
// ❌ Hapus Menu
// =========================
export const hapusMenu = (id_menu, callback) => {
  db.query(
    "DELETE FROM menu WHERE id_menu = ?",
    [id_menu],
    callback
  );
};

// =========================
// ⚙️ Update Menu
// =========================
export const updateMenuById = (id, data, callback) => {
  const sql = `
    UPDATE menu SET
      nama_menu = ?,
      id_kategori = ?,
      harga = ?,
      deskripsi = ?,
      status_tersedia = ?,
      gambar_menu = COALESCE(?, gambar_menu),
      public_id = COALESCE(?, public_id)
    WHERE id_menu = ?
  `;

  db.query(sql, [
    data.nama_menu,
    data.id_kategori,
    data.harga,
    data.deskripsi,
    data.status_tersedia,
    data.gambar_menu,
    data.public_id,
    id
  ], callback);
};
