import db from '../config/db.js';

export const getBerandaSummaryModel = (tanggal, kemarin, callback) => {
  const qPemesanan = `
    SELECT 
      SUM(CASE WHEN tanggal_pemesanan = ? THEN 1 ELSE 0 END) AS hari_ini,
      SUM(CASE WHEN tanggal_pemesanan = ? THEN 1 ELSE 0 END) AS kemarin
    FROM pemesanan
  `;

  const qReservasi = `
    SELECT 
      SUM(CASE WHEN tanggal_reservasi = ? THEN 1 ELSE 0 END) AS hari_ini,
      SUM(CASE WHEN tanggal_reservasi = ? THEN 1 ELSE 0 END) AS kemarin
    FROM reservasi
  `;

  const qPendapatan = `
    SELECT 
      SUM(CASE WHEN DATE(waktu_bayar) = ? THEN jumlah_bayar ELSE 0 END) AS hari_ini,
      SUM(CASE WHEN DATE(waktu_bayar) = ? THEN jumlah_bayar ELSE 0 END) AS kemarin
    FROM pembayaran
    WHERE status_pembayaran = 'sudah_bayar'
  `;

  const qMenuTerlaris = `
    SELECT m.nama_menu, SUM(dp.jumlah) AS total
    FROM detail_pemesanan dp
    JOIN menu m ON dp.id_menu = m.id_menu
    GROUP BY m.id_menu
    ORDER BY total DESC
    LIMIT 3
  `;

  const qMejaTersedia = `
    SELECT COUNT(*) AS total FROM meja WHERE status_meja = 'tersedia'
  `;

  const qMenuHabis = `
    SELECT COUNT(*) AS total FROM menu WHERE status_tersedia = 'habis'
  `;

  const qMenungguPembayaran = `
    SELECT
      (SELECT COUNT(*) FROM pemesanan WHERE status_pemesanan = 'menunggu_pembayaran') +
      (SELECT COUNT(*) FROM reservasi WHERE status_reservasi = 'menunggu_pembayaran')
      AS total
  `;

  db.query(qPemesanan, [tanggal, kemarin], (e1, p) => {
    if (e1) return callback(e1);

    db.query(qReservasi, [tanggal, kemarin], (e2, r) => {
      if (e2) return callback(e2);

      db.query(qPendapatan, [tanggal, kemarin], (e3, d) => {
        if (e3) return callback(e3);

        db.query(qMenuTerlaris, (e4, m) => {
          if (e4) return callback(e4);

          db.query(qMejaTersedia, (e5, meja) => {
            if (e5) return callback(e5);

            db.query(qMenuHabis, (e6, menuHabis) => {
              if (e6) return callback(e6);

              db.query(qMenungguPembayaran, (e7, menunggu) => {
                if (e7) return callback(e7);

                callback(null, {
                  pemesanan: {
                    hari_ini: p[0].hari_ini || 0,
                    selisih: (p[0].hari_ini || 0) - (p[0].kemarin || 0),
                  },
                  reservasi: {
                    hari_ini: r[0].hari_ini || 0,
                    selisih: (r[0].hari_ini || 0) - (r[0].kemarin || 0),
                  },
                  pendapatan: {
                    hari_ini: d[0].hari_ini || 0,
                    selisih: (d[0].hari_ini || 0) - (d[0].kemarin || 0),
                  },
                  menuTerlaris: m,
                  mejaTersedia: meja[0].total,
                  menuHabis: menuHabis[0].total,
                  menungguPembayaran: menunggu[0].total,
                });
              });
            });
          });
        });
      });
    });
  });
};

export const getNotifikasiBerandaModel = (callback) => {
  const sql = `
  SELECT 'pemesanan' AS tipe,
         CONCAT(
           'Pemesanan #', id_pemesanan,
           ' masuk ',
           TIMESTAMPDIFF(MINUTE, created_at, NOW()),
           ' menit lalu'
         ) AS pesan
  FROM pemesanan
  WHERE status_pemesanan = 'menunggu_pembayaran'
    AND created_at >= NOW() - INTERVAL 5 MINUTE

  UNION ALL

  SELECT 'reservasi' AS tipe,
         CONCAT(
           'Reservasi #', id_reservasi,
           ' masuk ',
           TIMESTAMPDIFF(MINUTE, created_at, NOW()),
           ' menit lalu'
         ) AS pesan
  FROM reservasi
  WHERE status_reservasi = 'menunggu_pembayaran'
    AND created_at >= NOW() - INTERVAL 1 DAY

  UNION ALL

  SELECT 'menu' AS tipe,
         CONCAT('Menu ', nama_menu, ' habis') AS pesan
  FROM menu
  WHERE status = 'habis'

  UNION ALL

  SELECT 'feedback' AS tipe,
       CONCAT(
         'Feedback dari pemesanan #', f.id_pemesanan,
         ' (rating ', f.rating, ') ',
         TIMESTAMPDIFF(MINUTE, f.tanggal_feedback, NOW()),
         ' menit lalu'
       ) AS pesan
  FROM feedback f
  WHERE f.tanggal_feedback >= NOW() - INTERVAL 2 MINUTE
  
  ORDER BY tipe
  LIMIT 7
`;

  db.query(sql, (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};
