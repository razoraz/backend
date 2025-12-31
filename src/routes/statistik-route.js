import express from "express";
import {
  statistikPerHariPemesanan,
  statistikPerBulanPemesanan,
  statistikPerTahunPemesanan,
  statistikPerHariReservasi,
  statistikPerBulanReservasi,
  statistikPerTahunReservasi
} from "../controllers/statistik.js";

const router = express.Router();

router.get("/harian-pemesanan", statistikPerHariPemesanan);
router.get("/bulanan-pemesanan", statistikPerBulanPemesanan);
router.get("/tahunan-pemesanan", statistikPerTahunPemesanan);
router.get("/harian-reservasi", statistikPerHariReservasi);
router.get("/bulanan-reservasi", statistikPerBulanReservasi);
router.get("/tahunan-reservasi", statistikPerTahunReservasi);

export default router;
