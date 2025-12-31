import db from '../config/db.js';

// Fungsi untuk mendapatkan semua data detail pemesanan
export const getAllDetailPemesanan = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM detail_pemesanan';
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Fungsi untuk mendapatkan data detail pemesanan berdasarkan ID pemesanan
export const getDetailPemesananByPemesananId = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM detail_pemesanan WHERE id_pemesanan = ?';
    db.query(query, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Fungsi untuk mendapatkan data detail pemesanan dengan info menu
export const getDetailPemesananByMenu = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT d.*, m.nama_menu, m.harga, m.gambar_menu
      FROM detail_pemesanan d
      JOIN menu m ON d.id_menu = m.id_menu
      WHERE d.id_pemesanan = ?
    `;
    db.query(sql, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const getDetailItemPemesanan = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT d.*, m.nama_menu, m.harga
      FROM detail_pemesanan d
      JOIN menu m ON d.id_menu = m.id_menu
      WHERE d.id_pemesanan = ?
    `;

    db.query(sql, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Fungsi untuk mendapatkan data detail pemesanan berdasarkan ID
export const getDetailPemesananById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM detail_pemesanan WHERE id_detail = ?';
    db.query(query, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Fungsi untuk menghapus data detail pemesanan berdasarkan ID pemesanan
export const deleteDetailPemesananByPemesananId = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM detail_pemesanan WHERE id_pemesanan = ?";
    db.query(query, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Fungsi untuk menambah data detail pemesanan
export const addDetailPemesanan = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO detail_pemesanan
      (id_pemesanan, id_menu, jumlah, subtotal, catatan)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.id_pemesanan,
      data.id_menu,
      data.jumlah,
      data.subtotal,
      data.catatan
    ], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};