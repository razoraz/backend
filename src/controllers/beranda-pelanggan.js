import {
  getMenuTerlarisModel,
  getFeedbackModel,
  getEventPromoModel
} from '../models/beranda_pelanggan.js';

/* Menu Terlaris */
export const getMenuTerlaris = (req, res) => {
  getMenuTerlarisModel((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mengambil menu terlaris' });
    }
    res.json(data);
  });
};

/* Feedback */
export const getFeedback = (req, res) => {
  getFeedbackModel((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mengambil feedback' });
    }
    res.json(data);
  });
};

/* Event / Promo */
export const getEventPromo = (req, res) => {
  getEventPromoModel((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mengambil event' });
    }
    res.json(data[0]);
  });
};
