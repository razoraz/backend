import express from "express";
import upload from "../middlewares/uploadCloudinary.js";
import {
  getFeedbacks,
  createFeedback,
  deleteFeedbackById,
} from "../controllers/feedback.js";

const router = express.Router();

router.get("/", getFeedbacks);
router.post("/tambah-feedback", upload.single("image"), createFeedback);
router.delete("/:id_feedback", deleteFeedbackById);

export default router;
