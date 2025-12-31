import { getPerHariPemesanan, getPerHariReservasi, getPerBulanPemesanan, getPerBulanReservasi, getPerTahunPemesanan, getPerTahunReservasi } from "../models/statistik.js";

// ========================
// 📌 PER HARI
// ========================
export const statistikPerHariPemesanan = (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "Parameter start dan end wajib diisi" });
  }
  getPerHariPemesanan(start, end, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      labels: results.map(r => r.tgl),
      values: results.map(r => r.total)
    });
  });
};

export const statistikPerHariReservasi = (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) {
    return res.status(400).json({ message: "Parameter start dan end wajib diisi" });
  }
  getPerHariReservasi(start, end, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      labels: results.map(r => r.tgl),
      values: results.map(r => r.total)
    });
  });
};


// ========================
// 📌 PER BULAN
// ========================
export const statistikPerBulanPemesanan = (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: "Parameter year wajib diisi" });
  }

  getPerBulanPemesanan(year, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      labels: results.map(r => r.ym),
      values: results.map(r => r.total)
    });
  });
};

export const statistikPerBulanReservasi = (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: "Parameter year wajib diisi" });
  }
  getPerBulanReservasi(year, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      labels: results.map(r => r.ym),
      values: results.map(r => r.total)
    });
  });
};

// ========================
// 📌 PER TAHUN
// ========================
export const statistikPerTahunPemesanan = (req, res) => {
  getPerTahunPemesanan((err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      labels: results.map(r => r.year),
      values: results.map(r => r.total)
    });
  });
};
export const statistikPerTahunReservasi = (req, res) => {
  getPerTahunReservasi((err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      labels: results.map(r => r.year),
      values: results.map(r => r.total)
    });
  });
};  
