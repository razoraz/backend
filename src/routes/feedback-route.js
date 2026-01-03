import express from "express";
import upload from "../middlewares/uploadCloudinary.js";
import {
  getFeedbacks,
  createFeedback,
  deleteFeedbackByIdController,
} from "../controllers/feedback.js";

const router = express.Router();

router.get("/", getFeedbacks);
router.post("/tambah-feedback", upload.single("image"), createFeedback);
router.delete("/:id_feedback", deleteFeedbackByIdController);

export default router;
