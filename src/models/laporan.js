import db from '../config/db.js';


// ==========================
// Laporan Pemesanan
// ==========================
export const getLaporanPemesanan = (range) => {
  return new Promise((resolve, reject) => {
    let tanggalFilter = '';
    
    switch (range) {
      case 'hari':
        tanggalFilter = `DATE(p.tanggal_pemesanan) = CURDATE()`;
        break;
      case 'minggu':
        tanggalFilter = `YEARWEEK(p.tanggal_pemesanan, 1) = YEARWEEK(CURDATE(), 1)`;
        break;
      case 'bulan':
        tanggalFilter = `MONTH(p.tanggal_pemesanan) = MONTH(CURDATE()) AND YEAR(p.tanggal_pemesanan) = YEAR(CURDATE())`;
        break;
      case 'tahun':
        tanggalFilter = `YEAR(p.tanggal_pemesanan) = YEAR(CURDATE())`;
        break;
      default:
        tanggalFilter = '1=1';
    }

    const sql = `
      SELECT 
        p.tanggal_pemesanan,
        p.nama_pelanggan,
        p.no_meja,
        GROUP_CONCAT(CONCAT(m.nama_menu, ' x', d.jumlah) SEPARATOR ', ') AS daftar_menu,
        p.total_harga,
        p.status_pemesanan,
        mp.nama_metode AS metode_pembayaran,
        pb.status_pembayaran
      FROM pemesanan p
      LEFT JOIN detail_pemesanan d ON p.id_pemesanan = d.id_pemesanan
      LEFT JOIN menu m ON d.id_menu = m.id_menu
      LEFT JOIN pembayaran pb ON pb.id_pemesanan = p.id_pemesanan
      LEFT JOIN metode_pembayaran mp ON pb.id_metode = mp.id_metode
      WHERE ${tanggalFilter}
      GROUP BY p.id_pemesanan
      ORDER BY p.tanggal_pemesanan DESC
    `;

    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ==========================
// Laporan Reservasi
// ==========================
export const getLaporanReservasi = (range) => {
  return new Promise((resolve, reject) => {
    let tanggalFilter = '';
    
    switch (range) {
      case 'hari':
        tanggalFilter = `DATE(r.tanggal_dibuat) = CURDATE()`;
        break;
      case 'minggu':
        tanggalFilter = `YEARWEEK(r.tanggal_dibuat, 1) = YEARWEEK(CURDATE(), 1)`;
        break;
      case 'bulan':
        tanggalFilter = `MONTH(r.tanggal_dibuat) = MONTH(CURDATE()) AND YEAR(r.tanggal_dibuat) = YEAR(CURDATE())`;
        break;
      case 'tahun':
        tanggalFilter = `YEAR(r.tanggal_dibuat) = YEAR(CURDATE())`;
        break;
      default:
        tanggalFilter = '1=1';
    }

    const sql = `
      SELECT 
        r.tanggal_dibuat,
        r.tanggal_reservasi,
        r.jam_reservasi,
        r.nama_pelanggan,
        r.no_meja,
        r.nomor_whatsapp,
        GROUP_CONCAT(CONCAT(m.nama_menu, ' x', d.jumlah) SEPARATOR ', ') AS daftar_menu,
        p.total_harga,
        r.status_reservasi,
        mp.nama_metode AS metode_pembayaran,
        pb.status_pembayaran
      FROM reservasi r
      LEFT JOIN pemesanan p ON r.id_reservasi = p.id_reservasi
      LEFT JOIN detail_pemesanan d ON p.id_pemesanan = d.id_pemesanan
      LEFT JOIN menu m ON d.id_menu = m.id_menu
      LEFT JOIN pembayaran pb ON pb.id_pemesanan = p.id_pemesanan
      LEFT JOIN metode_pembayaran mp ON pb.id_metode = mp.id_metode
      WHERE ${tanggalFilter}
      GROUP BY r.id_reservasi
      ORDER BY r.tanggal_dibuat DESC
    `;

    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
