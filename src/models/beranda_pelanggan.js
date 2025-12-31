import db from '../config/db.js';

/* 🔥 Menu Terlaris */
export const getMenuTerlarisModel = (callback) => {
  const sql = `
    SELECT 
      m.id_menu,
      m.nama_menu,
      m.gambar_menu,
      SUM(dp.jumlah) AS total_pesan
    FROM detail_pemesanan dp
    JOIN menu m ON dp.id_menu = m.id_menu
    GROUP BY m.id_menu
    ORDER BY total_pesan DESC
    LIMIT 3
  `;
  db.query(sql, callback);
};

/* 💬 Feedback Pelanggan */
export const getFeedbackModel = (callback) => {
  const sql = `
    SELECT 
      f.feedback,
      f.rating,
      f.gambar_feedback,
      f.tanggal_feedback,
      p.nama_pelanggan
    FROM feedback f
    JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
    WHERE p.status_pemesanan = 'selesai'
    ORDER BY f.tanggal_feedback DESC
    LIMIT 5
  `;
  db.query(sql, callback);
};

/* 🎁 Event / Promo */
export const getEventPromoModel = (callback) => {
  const sql = `
    SELECT id_event, judul, deskripsi, gambar_event, tanggal
    FROM event_bc
    ORDER BY tanggal DESC
    LIMIT 1
  `;
  db.query(sql, callback);
};
