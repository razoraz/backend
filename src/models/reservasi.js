import db from '../config/db.js';

/**
 * =========================
 * LIST RESERVASI (UNTUK TABEL)
 * =========================
 */
export const getAllReservasiWithPayment = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        r.id_reservasi,
        r.tanggal_dibuat,
        r.nama_pelanggan,
        r.tanggal_reservasi,
        r.jam_reservasi,
        r.no_meja,
        r.status_reservasi,


        p.id_pemesanan,
        p.total_harga,

        pb.status_pembayaran,
        mp.nama_metode AS metode_pembayaran
      FROM reservasi r
      LEFT JOIN pemesanan p 
        ON r.id_reservasi = p.id_reservasi
      LEFT JOIN pembayaran pb 
        ON p.id_pemesanan = pb.id_pemesanan
      LEFT JOIN metode_pembayaran mp
        ON pb.id_metode = mp.id_metode
      ORDER BY r.tanggal_dibuat DESC, r.id_reservasi ASC
    `;

    db.query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * =========================
 * DETAIL RESERVASI
 * =========================
 */
export const getDetailReservasi = (id_reservasi) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        r.*,

        p.id_pemesanan,
        p.total_harga,

        pb.status_pembayaran,
        pb.order_id,
        pb.redirect_url,
        pb.waktu_bayar,
        mp.nama_metode
      FROM reservasi r
      LEFT JOIN pemesanan p 
        ON r.id_reservasi = p.id_reservasi
      LEFT JOIN pembayaran pb 
        ON p.id_pemesanan = pb.id_pemesanan
      LEFT JOIN metode_pembayaran mp
        ON pb.id_metode = mp.id_metode
      WHERE r.id_reservasi = ?
    `;

    db.query(sql, [id_reservasi], (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]);
    });
  });
};

/**
 * =========================
 * UPDATE STATUS RESERVASI
 * =========================
 */

export const updateReservasiModel = (id_reservasi, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE reservasi r
      LEFT JOIN pemesanan p 
        ON r.id_reservasi = p.id_reservasi
      SET
        r.tanggal_reservasi = ?,
        r.jam_reservasi = ?,
        r.status_reservasi = ?,
        p.status_pemesanan = ?
      WHERE r.id_reservasi = ?
    `;

    const values = [
      data.tanggal_reservasi,
      data.jam_reservasi,
      data.status_reservasi,
      data.status_reservasi, // sinkron status
      id_reservasi,
    ];

    db.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};


/**
 * =========================
 * DELETE RESERVASI
 * =========================
 */
export const deleteReservasiById = (id_reservasi) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM reservasi WHERE id_reservasi = ?`;
    db.query(sql, [id_reservasi], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
export const addReservasi = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO reservasi
      (tanggal_dibuat, tanggal_reservasi, jam_reservasi, nama_pelanggan, no_meja, nomor_whatsapp, status_reservasi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [data.tanggal_dibuat, data.tanggal_reservasi, data.jam_reservasi, data.nama_pelanggan, data.no_meja, data.nomor_whatsapp, data.status_reservasi], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};

export const getDetailItemReservasi = (id_reservasi) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        d.id_detail,
        d.jumlah,
        d.subtotal,
        d.catatan,

        m.id_menu,
        m.nama_menu,
        m.harga
      FROM reservasi r
      JOIN pemesanan p 
        ON r.id_reservasi = p.id_reservasi
      JOIN detail_pemesanan d 
        ON p.id_pemesanan = d.id_pemesanan
      JOIN menu m 
        ON d.id_menu = m.id_menu
      WHERE r.id_reservasi = ?
    `;

    db.query(sql, [id_reservasi], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
