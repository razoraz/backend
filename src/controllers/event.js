import {
  getAllEventModel,
  getEventByIdModel,
  addEventModel,
  updateEventModel,
  deleteEventModel
} from '../models/event.js';

// GET ALL
export const getAllEvent = (req, res) => {
  getAllEventModel((err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(data);
  });
};

// GET BY ID
export const getEventById = (req, res) => {
  getEventByIdModel(req.params.id, (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(data[0]);
  });
};

// ADD
export const addEvent = (req, res) => {
  const { judul, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : null;

  if (!gambar) {
    return res.status(400).json({ message: 'Gambar wajib diupload' });
  }

  addEventModel([judul, deskripsi, gambar], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Event berhasil ditambahkan' });
  });
};

// UPDATE
export const updateEvent = (req, res) => {
  const { judul, deskripsi } = req.body;
  const gambar = req.file ? req.file.filename : req.body.gambar_lama;

  updateEventModel(req.params.id, [judul, deskripsi, gambar], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Event berhasil diupdate' });
  });
};

// DELETE
export const deleteEvent = (req, res) => {
  const { id } = req.params;

  deleteEventModel(id, (err) => {
    if (err) {
      console.error("Error hapus event:", err);
      return res.status(500).json({
        message: err.message || "Gagal menghapus event",
      });
    }

    res.json({ message: "Event berhasil dihapus!" });
  });
};