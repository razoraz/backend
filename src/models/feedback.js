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
  const { id_pemesanan, email, feedback, gambar_feedback, public_id, rating } = data;

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO feedback 
       (id_pemesanan, email, feedback, gambar_feedback, public_id, rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_pemesanan, email, feedback, gambar_feedback, public_id, rating],
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
export const deleteFeedbackById = (id_feedback) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM feedback WHERE id_feedback = ?",
      [id_feedback],
      (err, result) => {
        if (err) reject(err);
        resolve(result);
      }
    );
  });
};

export const getFeedbackById = (id_feedback) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM feedback WHERE id_feedback = ?",
      [id_feedback],
      (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      }
    );
  });
};

