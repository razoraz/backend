import db from "../config/db.js";
import fs from "fs";
import path from "path";

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
    SELECT m.*, k.nama_kategori 
    FROM menu m
    JOIN kategori_menu k ON m.id_kategori = k.id_kategori
    WHERE m.id_menu = ?
  `;
  db.query(sql, [id_menu], callback);
};

// =========================
// ➕ Tambah Menu Baru
// =========================
export const tambahMenu = (data, callback) => {
  const sql = `
    INSERT INTO menu (nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_menu)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      data.nama_menu,
      data.id_kategori,
      data.harga,
      data.deskripsi,
      data.status_tersedia,
      data.gambar_menu,
    ],
    callback
  );
};

// =========================
// 🔍 Cari & Filter Menu
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

  sql += " ORDER BY m.id_menu DESC";

  db.query(sql, params, callback);
};

// =========================
// ❌ Hapus Menu
// =========================
export const hapusMenu = (id_menu, callback) => {
  const getSql = "SELECT gambar_menu FROM menu WHERE id_menu = ?";
  db.query(getSql, [id_menu], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(new Error("Menu tidak ditemukan"), null);

    const gambar = results[0].gambar_menu;

    const deleteSql = "DELETE FROM menu WHERE id_menu = ?";
    db.query(deleteSql, [id_menu], (deleteErr, deleteResult) => {
      if (deleteErr) return callback(deleteErr, null);

      if (gambar) {
        const filePath = path.join("uploads", gambar);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      callback(null, deleteResult);
    });
  });
};

// =========================
// ⚙️ Update Menu
// =========================
export const updateMenuById = (id, data, callback) => {
  const { nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_menu } = data;

  db.query("SELECT gambar_menu FROM menu WHERE id_menu = ?", [id], (err, results) => {
    if (err) return callback(err, null);

    const oldImage = results[0]?.gambar_menu;

    const query = `
      UPDATE menu SET
        nama_menu = ?,
        id_kategori = ?,
        harga = ?,
        deskripsi = ?,
        status_tersedia = ?,
        gambar_menu = COALESCE(?, gambar_menu)
      WHERE id_menu = ?
    `;

    db.query(
      query,
      [nama_menu, id_kategori, harga, deskripsi, status_tersedia, gambar_menu, id],
      (err2, result) => {
        if (err2) return callback(err2, null);

        // Hapus gambar lama kalau upload baru
        if (gambar_menu && oldImage && gambar_menu !== oldImage) {
          const oldPath = path.join(process.cwd(), "uploads", oldImage);
          fs.unlink(oldPath, (err3) => {
            if (err3) console.warn("⚠️ Gagal hapus gambar lama:", err3);
          });
        }

        callback(null, result);
      }
    );
  });
};
