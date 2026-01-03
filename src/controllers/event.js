import cloudinary from '../config/cloudinary.js';
import {
  getAllEventModel,
  getEventByIdModel,
  addEventModel,
  updateEventModel,
  deleteEventModel
} from '../models/event.js';

// GET ALL
export const getAllEvent = async (req, res) => {
  try {
    const events = await getAllEventModel();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
export const getEventById = async (req, res) => {
  try {
    const event = await getEventByIdModel(req.params.id);
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD EVENT
export const addEvent = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Gambar wajib diupload" });

    // Upload ke Cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: 'event',
    });

    const data = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      gambar_url: upload.secure_url,
      public_id: upload.public_id,
    };

    await addEventModel(data);
    res.json({ message: 'Event berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const event = await getEventByIdModel(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event tidak ditemukan' });

    let gambar_url = event.gambar_event;
    let public_id = event.public_id;

    if (req.file) {
      // Hapus gambar lama di Cloudinary
      if (public_id) await cloudinary.uploader.destroy(public_id);

      // Upload gambar baru
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'event',
      });
      gambar_url = upload.secure_url;
      public_id = upload.public_id;
    }

    const data = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi,
      gambar_url,
      public_id,
    };

    await updateEventModel(req.params.id, data);
    res.json({ message: 'Event berhasil diupdate' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { deleteResult, public_id } = await deleteEventModel(req.params.id);

    // Hapus gambar Cloudinary
    if (public_id) {
      await cloudinary.uploader.destroy(public_id);
    }

    res.json({ message: "Event berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
