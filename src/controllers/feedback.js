import { addFeedback, getAllFeedback, deleteFeedbackById, getFeedbackById } from '../models/feedback.js';
import cloudinary from '../config/cloudinary.js';

// Tambah feedback

export const getFeedbacks = async (req, res) => {
  try {
    const data = await getAllFeedback();

    res.status(200).json({
      status: 'success',
      message: 'Data feedback berhasil diambil',
      data: data,
    });
  } catch (error) {
    console.error('Error get feedback:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data feedback',
    });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { id_pemesanan, email, pesan, rating } = req.body;

    if (!id_pemesanan || !email || !pesan || !rating) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    let gambar_feedback = null;
    let public_id = null;

    if (req.file) {
      gambar_feedback = req.file.path; // URL
      public_id = req.file.filename; // public_id Cloudinary
    }

    await addFeedback({
      id_pemesanan,
      email,
      feedback: pesan,
      gambar_feedback,
      public_id,
      rating,
    });

    res.status(201).json({ message: 'Feedback berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

// DELETE feedback by ID
export const deleteFeedbackByIdController = async (req, res) => {
  try {
    const { id_feedback } = req.params;

    if (!id_feedback) {
      return res.status(400).json({ message: 'ID feedback tidak ditemukan' });
    }

    // Ambil data feedback dulu
    const feedback = await getFeedbackById(id_feedback);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback tidak ditemukan' });
    }

    // Hapus gambar di Cloudinary kalau ada
    if (feedback.public_id) {
      await cloudinary.uploader.destroy(feedback.public_id);
    }

    // Hapus feedback dari DB
    await deleteFeedbackById(id_feedback);

    res.status(200).json({ message: 'Feedback berhasil dihapus' });
  } catch (error) {
    console.error('Error delete feedback:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};