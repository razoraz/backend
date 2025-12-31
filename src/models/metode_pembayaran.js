import db from '../config/db.js';

// Ambil Semua Metode Pembayaran
export const getAllMetodePembayaran = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM metode_pembayaran ORDER BY id_metode DESC`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ✅ TAMBAH FUNGSI: Get metode pembayaran by ID
export const getMetodePembayaranById = (id_metode) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM metode_pembayaran WHERE id_metode = ?`;
    db.query(sql, [id_metode], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};