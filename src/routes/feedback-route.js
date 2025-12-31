import express from "express";
import multer from "multer";
import path from "path";
import { getFeedbacks, createFeedback , deleteFeedbackById } from "../controllers/feedback.js";

const router = express.Router();

// Folder upload harus ada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/feedback"); // pastikan folder ada
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// GET semua feedback
router.get("/", getFeedbacks);
// POST tambah feedback
router.post("/tambah-feedback", upload.single("image"), createFeedback);
// DELETE feedback by ID
router.delete("/:id_feedback", deleteFeedbackById);

export default router;
