import { addFeedback, getAllFeedback, deleteFeedback } from "../models/feedback.js";



// Tambah feedback

export const getFeedbacks = async (req, res) => {
   try {
    const data = await getAllFeedback();

    res.status(200).json({
      status: "success",
      message: "Data feedback berhasil diambil",
      data: data
    });
  } catch (error) {
    console.error("Error get feedback:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data feedback"
    });
  }
};

export const createFeedback = async (req, res) => {
  try {
    const { id_pemesanan, email, pesan, rating } = req.body;

    if (!id_pemesanan || !email || !pesan || !rating) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    let gambar_feedback = null;
    if (req.file) {
      gambar_feedback = req.file.filename; // nama file dari multer
    }

    await addFeedback({
      id_pemesanan,
      email,
      feedback: pesan,
      gambar_feedback,
      rating,
    });

    res.status(201).json({
      message: "Feedback berhasil ditambahkan",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// DELETE feedback by ID
export const deleteFeedbackById = async (req, res) => {
  try {
    const { id_feedback } = req.params;

    if (!id_feedback) {
      return res.status(400).json({
        status: "error",
        message: "ID feedback tidak ditemukan",
      });
    }

    await deleteFeedback(id_feedback);

    res.status(200).json({
      status: "success",
      message: "Feedback dan gambar berhasil dihapus",
    });

  } catch (error) {
    console.error("Error delete feedback:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Gagal menghapus feedback",
    });
  }
};