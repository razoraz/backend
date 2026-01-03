import db from '../config/db.js';

// GET ALL
export const getAllEventModel = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM event_bc ORDER BY tanggal DESC`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// GET BY ID
export const getEventByIdModel = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM event_bc WHERE id_event = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) reject(err);
      resolve(result[0]);
    });
  });
};

// ADD EVENT
export const addEventModel = (data) => {
  const { judul, deskripsi, gambar_url, public_id } = data;
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO event_bc (judul, deskripsi, gambar_event, public_id)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [judul, deskripsi, gambar_url, public_id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// UPDATE EVENT
export const updateEventModel = (id, data) => {
  const { judul, deskripsi, gambar_url, public_id } = data;
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE event_bc
      SET judul = ?, deskripsi = ?, gambar_event = COALESCE(?, gambar_event), public_id = COALESCE(?, public_id)
      WHERE id_event = ?
    `;
    db.query(sql, [judul, deskripsi, gambar_url, public_id, id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

// DELETE EVENT
export const deleteEventModel = async (id_event) => {
  return new Promise((resolve, reject) => {
    const getSql = "SELECT gambar_event, public_id FROM event_bc WHERE id_event = ?";
    db.query(getSql, [id_event], async (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return reject(new Error("Event tidak ditemukan"));

      const { public_id } = results[0];

      // Hapus data dari DB
      const deleteSql = "DELETE FROM event_bc WHERE id_event = ?";
      db.query(deleteSql, [id_event], async (deleteErr, deleteResult) => {
        if (deleteErr) return reject(deleteErr);

        resolve({ deleteResult, public_id });
      });
    });
  });
};
