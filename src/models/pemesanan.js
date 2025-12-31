import db from '../config/db.js';

// Fungsi untuk mendapatkan data meja berdasarkan ID
export const getMejaById = (id_meja) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM meja WHERE id_meja = ?';
    db.query(query, [id_meja], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

export const getPemesananById = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM pemesanan WHERE id_pemesanan = ?';
    db.query(query, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Fungsi untuk mendapatkan semua data pemesanan
export const getAllPemesanan = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM pemesanan';
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Fungsi untuk menghapus data pemesanan berdasarkan ID

export const deletePemesananById = (id_pemesanan, callback) => {
  const sql = `DELETE FROM pemesanan WHERE id_pemesanan = ?`;
  db.query(sql, [id_pemesanan], (err, result) => {
    callback(err, result);
  });
};

// Fungsi untuk menambah data pemesanan
export const addPemesanan = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO pemesanan 
      (tanggal_pemesanan, nama_pelanggan, id_reservasi, no_meja, total_harga, status_pemesanan) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [data.tanggal_pemesanan, data.nama_pelanggan, data.id_reservasi || null, data.no_meja, data.total_harga, data.status_pemesanan || 'menunggu_pembayaran'], (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
};

export const getPemesananByOrderId = (order_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.id_pemesanan,
        p.id_reservasi,
        p.no_meja,
        p.status_pemesanan,
        pb.status_pembayaran
      FROM pembayaran pb
      JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
      WHERE pb.order_id = ?
    `;
    db.query(sql, [order_id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// ✅ TAMBAH FUNGSI: Update status pemesanan
export const updateStatusPemesanan = (id_pemesanan, status_pemesanan) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE pemesanan SET status_pemesanan = ? WHERE id_pemesanan = ?';
    db.query(sql, [status_pemesanan, id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Update status meja
export const updateStatusMeja = (no_meja, status) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE meja SET status_meja = ? WHERE no_meja = ?';
    db.query(sql, [status, no_meja], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get status meja
export const getStatusMeja = (no_meja) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT status FROM meja WHERE no_meja = ?';
    db.query(sql, [no_meja], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

// Fungsi untuk menampilkan data pemesanan, detail pemesanan, dan pemesanan
export const getAllPemesananWithPayment = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.id_pemesanan,
        p.nama_pelanggan,
        p.tanggal_pemesanan,
        p.no_meja,
        p.total_harga,
        mp.nama_metode AS metode_pembayaran,
        p.status_pemesanan,
        pb.status_pembayaran
      FROM pemesanan p
      LEFT JOIN pembayaran pb 
        ON p.id_pemesanan = pb.id_pemesanan
      LEFT JOIN metode_pembayaran mp
        ON pb.id_metode = mp.id_metode
      WHERE p.id_reservasi IS NULL
      ORDER BY p.tanggal_pemesanan DESC, p.id_pemesanan ASC
    `;

    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

export const getDetailFullPemesanan = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.id_pemesanan,
        p.nama_pelanggan,
        p.tanggal_pemesanan,
        p.no_meja,
        p.total_harga,
        p.status_pemesanan,
      
        pb.id_pembayaran,
        pb.id_metode,
        pb.status_pembayaran,
        pb.waktu_bayar,
        pb.order_id,

        mp.nama_metode
        
      FROM pemesanan p
      LEFT JOIN pembayaran pb ON p.id_pemesanan = pb.id_pemesanan
      LEFT JOIN metode_pembayaran mp ON pb.id_metode = mp.id_metode
      WHERE p.id_pemesanan = ?
    `;

    db.query(sql, [id_pemesanan], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

export const getDetailStrukModel = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.id_pemesanan,
        p.nama_pelanggan,
        p.no_meja,
        p.tanggal_pemesanan,
        p.total_harga,
        p.status_pemesanan,
        
        r.id_reservasi,
        r.tanggal_reservasi,
        r.jam_reservasi,

        pm.id_pembayaran,
        pm.status_pembayaran,
        pm.jumlah_bayar,
        pm.order_id,
        pm.redirect_url,
        pm.waktu_bayar,
        pm.id_metode,

        mp.nama_metode AS metode_pembayaran,

        d.id_detail,
        d.jumlah,
        d.subtotal,

        m.nama_menu

      FROM pemesanan p
      LEFT JOIN reservasi r 
        ON p.id_reservasi = r.id_reservasi
      LEFT JOIN pembayaran pm 
        ON p.id_pemesanan = pm.id_pemesanan
      LEFT JOIN metode_pembayaran mp 
        ON pm.id_metode = mp.id_metode
      LEFT JOIN detail_pemesanan d 
        ON p.id_pemesanan = d.id_pemesanan
      LEFT JOIN menu m 
        ON d.id_menu = m.id_menu
      WHERE p.id_pemesanan = ?
    `;

    db.query(sql, [id_pemesanan], (err, rows) => {
      if (err) return reject(err);
      if (!rows.length) return resolve(null);

      const header = {
        id_pemesanan: rows[0].id_pemesanan,
        nama_pelanggan: rows[0].nama_pelanggan,
        no_meja: rows[0].no_meja,
        waktu_bayar: rows[0].waktu_bayar,
        total_harga: rows[0].total_harga,
        status_pembayaran: rows[0].status_pembayaran,
        metode_pembayaran: rows[0].metode_pembayaran,
        reservasi: rows[0].id_reservasi
          ? {
              id_reservasi: rows[0].id_reservasi,
              tanggal_reservasi: rows[0].tanggal_reservasi,
              jam_reservasi: rows[0].jam_reservasi,
            }
          : null,
        detail_menu: [],
      };

      rows.forEach((r) => {
        if (r.id_detail) {
          header.detail_menu.push({
            nama_menu: r.nama_menu,
            jumlah: r.jumlah,
            subtotal: r.subtotal,
          });
        }
      });

      resolve(header);
    });
  });
};
