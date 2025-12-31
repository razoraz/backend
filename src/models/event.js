import db from '../config/db.js';
import fs from "fs";
import path from "path";

export const getAllEventModel = (callback) => {
  const sql = `SELECT * FROM event_bc ORDER BY tanggal DESC`;
  db.query(sql, callback);
};

export const getEventByIdModel = (id, callback) => {
  const sql = `SELECT * FROM event_bc WHERE id_event = ?`;
  db.query(sql, [id], callback);
};

export const addEventModel = (data, callback) => {
  const sql = `
    INSERT INTO event_bc (judul, deskripsi, gambar_event)
    VALUES (?, ?, ?)
  `;
  db.query(sql, data, callback);
};

export const updateEventModel = (id, data, callback) => {
  const sql = `
    UPDATE event_bc 
    SET judul = ?, deskripsi = ?, gambar_event = ?
    WHERE id_event = ?
  `;
  db.query(sql, [...data, id], callback);
};

export const deleteEventModel = (id_event, callback) => {
  // 1. Ambil nama file dulu
  const getSql = "SELECT gambar_event FROM event_bc WHERE id_event = ?";
  db.query(getSql, [id_event], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0)
      return callback(new Error("Event tidak ditemukan"), null);

    const gambar = results[0].gambar_event;

    // 2. Hapus data event
    const deleteSql = "DELETE FROM event_bc WHERE id_event = ?";
    db.query(deleteSql, [id_event], (deleteErr, deleteResult) => {
      if (deleteErr) return callback(deleteErr, null);

      // 3. Hapus file di folder uploads/event
      if (gambar) {
        const filePath = path.join(
          process.cwd(),
          "uploads",
          "event",
          gambar
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      callback(null, deleteResult);
    });
  });
};