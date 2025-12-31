import db from '../config/db.js';

// Fungsi untuk mendapatkan semua data pembayaran
export const getAllPembayaran = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM pembayaran';
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Fungsi untuk mendapatkan data pembayaran berdasarkan ID
export const getPembayaranById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM pembayaran WHERE id_pembayaran = ?';
    db.query(query, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// ✅ PERBAIKI: Gunakan nama kolom yang sesuai dengan database
export const addPembayaran = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
INSERT INTO pembayaran 
      (id_pemesanan, id_metode, id_admin, jumlah_bayar, waktu_bayar, order_id, redirect_url, status_pembayaran, midtrans_response)
      VALUES (?, ?, NULL, ?, NULL, ?, ?, ?, ?)
    `;
    db.query(sql, [data.id_pemesanan, data.id_metode, data.jumlah_bayar, data.order_id, data.redirect_url, data.status_pembayaran || 'belum_bayar', JSON.stringify(data.midtrans_response)], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};

// Ambil pembayaran berdasarkan id_pemesanan
export const getPembayaranByPemesananId = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM pembayaran WHERE id_pemesanan = ?`;
    db.query(sql, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// ✅ PERBAIKI: Update status pembayaran
export const updateStatusPembayaran = (order_id, status, jumlah_bayar, midtrans_response = {}) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE pembayaran
      SET 
        status_pembayaran = ?, 
        jumlah_bayar = ?, 
        midtrans_response = ?, 
        waktu_bayar = NOW()
      WHERE order_id = ?
    `;

    db.query(sql, [status, jumlah_bayar, JSON.stringify(midtrans_response), order_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const updateStatusPembayaranAdmin = (id_pemesanan, status_pembayaran = {}) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE pembayaran
      SET 
      status_pembayaran = ?,
      waktu_bayar = NOW() WHERE id_pemesanan = ?
    `;
    db.query(sql, [status_pembayaran, id_pemesanan], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Fungsi untuk menghapus data pembayaran berdasarkan ID pemesanan
export const deletePembayaranByPemesananId = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM pembayaran WHERE id_pemesanan = ?';
    db.query(query, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Ambil pembayaran berdasarkan order_id
export const getPembayaranByOrderId = (order_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM pembayaran WHERE order_id = ?`;
    db.query(sql, [order_id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// ✅ TAMBAH FUNGSI: Get pemesanan & pembayaran by order_id (JOIN)
export const getPemesananPembayaranByOrderId = (order_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.*, pb.* 
      FROM pemesanan p
      JOIN pembayaran pb ON p.id_pemesanan = pb.id_pemesanan
      WHERE pb.order_id = ?
    `;
    db.query(sql, [order_id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};
