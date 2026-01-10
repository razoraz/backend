import express from "express";
import {
  getKategori,
  tambahKategori,
  hapusKategori,
  perbaruiKategori,
} from "../controllers/kelola-kategori.js";

const router = express.Router();

// GET semua kategori
router.get("/", getKategori);
router.post("/", tambahKategori);
router.delete("/:id_kategori", hapusKategori);
router.put("/:id_kategori", perbaruiKategori);

export default router;