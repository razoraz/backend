import db from '../config/db.js';

export const Meja = {

  // Mengambil semua data meja
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM meja', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  // Mengambil data meja berdasarkan ID
  getById: (id_meja) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM meja WHERE id_meja = ?', [id_meja], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Mengambil data meja berdasarkan no_meja
  getByNo: (no_meja) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM meja WHERE no_meja = ?', [no_meja], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Membuat data meja baru
  create: (data) => {
    return new Promise((resolve, reject) => {
      const { no_meja, kapasitas, status_meja, token } = data;
      db.query('INSERT INTO meja (no_meja, kapasitas, status_meja, token) VALUES (?, ?, ?, ?)', [no_meja, kapasitas, status_meja || 'tersedia', token || null], (err, results) => {
        if (err) reject(err);
        else resolve(results.insertId);
      });
    });
  },

  // Memperbarui data meja
  update: (id_meja, data) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM meja WHERE id_meja = ?', [id_meja], (err, results) => {
        if (err) return reject(err);

        const current = results[0];

        const no_meja = data.no_meja ?? current.no_meja;
        const kapasitas = data.kapasitas ?? current.kapasitas;
        const status_meja = data.status_meja ?? current.status_meja;

        db.query('UPDATE meja SET no_meja = ?, kapasitas = ?, status_meja = ? WHERE id_meja = ?', [no_meja, kapasitas, status_meja, id_meja], (err, updateResults) => {
          if (err) reject(err);
          else resolve(updateResults);
        });
      });
    });
  },

  // Menghapus data meja
  delete: (id_meja) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM meja WHERE id_meja = ?', [id_meja], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },
};

export default Meja;
