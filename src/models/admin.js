import db from '../config/db.js';

const Admin = {
  // =======================
  // 👤 Models Login Admin
  // =======================
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // =======================
  // 🔑 Models Lupa Password Admin
  // =======================
  findByEmailAndKode: (email, kode_admin) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM admin WHERE email = ? AND kode_admin = ?', [email, kode_admin], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      });
    });
  },

  // =======================
  // 🔄 Models Update Password Admin
  // =======================
  updatePassword: (email, hashedPassword) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE admin SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  },
};

export default Admin;
