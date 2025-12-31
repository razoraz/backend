import db from "../config/db.js";

// =======================
// 📌 PEMESANAN PER HARI
// =======================
export const getPerHariPemesanan = (start, end, callback) => {
  const query = `
    SELECT DATE(tanggal_pemesanan) AS tgl, COUNT(*) AS total
    FROM pemesanan
    WHERE status_pemesanan = 'selesai'
      AND DATE(tanggal_pemesanan) BETWEEN ? AND ?
    GROUP BY tgl
    ORDER BY tgl;
  `;
  db.query(query, [start, end], callback);
};

// =======================
// 📌 PEMESANAN PER BULAN
// =======================
export const getPerBulanPemesanan = (year, callback) => {
  const query = `
    SELECT DATE_FORMAT(tanggal_pemesanan, '%Y-%m') AS ym, COUNT(*) AS total
    FROM pemesanan
    WHERE status_pemesanan = 'selesai'
      AND YEAR(tanggal_pemesanan) = ?
    GROUP BY ym
    ORDER BY ym;
  `;
  db.query(query, [year], callback);
};

// =======================
// 📌 PEMESANAN PER TAHUN
// =======================
export const getPerTahunPemesanan = (callback) => {
  const query = `
    SELECT YEAR(tanggal_pemesanan) AS year, COUNT(*) AS total
    FROM pemesanan
    WHERE status_pemesanan = 'selesai'
    GROUP BY year
    ORDER BY year;
  `;
  db.query(query, callback);
};

// =======================
// 📌 RESERVASI PER HARI
// =======================
export const getPerHariReservasi = (start, end, callback) => {
  const query = `
    SELECT DATE(tanggal_dibuat) AS tgl, COUNT(*) AS total
    FROM reservasi
    WHERE status_reservasi = 'selesai'
      AND DATE(tanggal_dibuat) BETWEEN ? AND ?
    GROUP BY tgl
    ORDER BY tgl;
  `;
  db.query(query, [start, end], callback);
};

// =======================
// 📌 RESERVASI PER BULAN
// =======================
export const getPerBulanReservasi = (year, callback) => {
  const query = `
    SELECT DATE_FORMAT(tanggal_dibuat, '%Y-%m') AS ym, COUNT(*) AS total
    FROM reservasi
    WHERE status_reservasi = 'selesai'
      AND YEAR(tanggal_dibuat) = ?
    GROUP BY ym
    ORDER BY ym;
  `;
  db.query(query, [year], callback);
};

// =======================
// 📌 RESERVASI PER TAHUN
// =======================
export const getPerTahunReservasi = (callback) => {
  const query = `
    SELECT YEAR(tanggal_dibuat) AS year, COUNT(*) AS total
    FROM reservasi
    WHERE status_dibuat = 'selesai'
    GROUP BY year
    ORDER BY year;
  `;
  db.query(query, callback);
};
