import db from "../config/db.js";

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
    const sql = "DELETE FROM feedback WHERE id_feedback = ?";
    db.query(sql, [id_feedback], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};


