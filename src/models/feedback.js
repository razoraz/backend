import db from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

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
// DELETE feedback by ID + Cloudinary
// =======================
export const deleteFeedback = (id_feedback) => {
  return new Promise((resolve, reject) => {
    // 1️⃣ Ambil URL gambar dari DB
    const getSql = "SELECT gambar_feedback FROM feedback WHERE id_feedback = ?";
    db.query(getSql, [id_feedback], async (err, results) => {
      if (err) return reject(err);
      if (results.length === 0)
        return reject(new Error("Feedback tidak ditemukan"));

      const gambarUrl = results[0].gambar_feedback;

      try {
        // 2️⃣ Hapus gambar Cloudinary (jika ada)
        if (gambarUrl) {
          const publicId = gambarUrl
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0]; // feedback/abc123

          await cloudinary.uploader.destroy(publicId);
        }

        // 3️⃣ Hapus data feedback di DB
        const deleteSql = "DELETE FROM feedback WHERE id_feedback = ?";
        db.query(deleteSql, [id_feedback], (deleteErr, deleteResult) => {
          if (deleteErr) return reject(deleteErr);
          resolve(deleteResult);
        });
      } catch (cloudErr) {
        reject(cloudErr);
      }
    });
  });
};


