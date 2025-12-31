import db from "../config/db.js";
import fs from "fs";
import path from "path";

// =======================
// GET semua feedback
// =======================
export const getAllFeedback = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM feedback ORDER BY tanggal_feedback DESC",
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

// =======================
// GET feedback by ID pemesanan
// =======================
export const getFeedbackByPemesanan = (id_pemesanan) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM feedback WHERE id_pemesanan = ?",
      [id_pemesanan],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};

// =======================
// ADD feedback
// =======================
export const addFeedback = (data) => {
  const { id_pemesanan, email, feedback, gambar_feedback, rating } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO feedback (id_pemesanan, email, feedback, gambar_feedback, rating)
       VALUES (?, ?, ?, ?, ?)`,
      [id_pemesanan, email, feedback, gambar_feedback, rating],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

// =======================
// DELETE feedback by ID
// =======================
export const deleteFeedback = (id_feedback) => {
  return new Promise((resolve, reject) => {
    // 1. Ambil nama file feedback
    const getSql = "SELECT gambar_feedback FROM feedback WHERE id_feedback = ?";
    db.query(getSql, [id_feedback], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0)
        return reject(new Error("Feedback tidak ditemukan"));

      const gambar = results[0].gambar_feedback;

      // 2. Hapus data feedback
      const deleteSql = "DELETE FROM feedback WHERE id_feedback = ?";
      db.query(deleteSql, [id_feedback], (deleteErr, deleteResult) => {
        if (deleteErr) return reject(deleteErr);

        // 3. Hapus file gambar jika ada
        if (gambar) {
          const filePath = path.join(
            process.cwd(),
            "uploads",
            "feedback",
            gambar
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        resolve(deleteResult);
      });
    });
  });
};

