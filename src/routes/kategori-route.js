import express from "express";
import {
  getKategori,
  tambahKategori,
  hapusKategori,
  perbaruiKategori,
} from "../controllers/kelola-kategori.js";

const router = express.Router();

// GET semua kategori
router.get("/kategori-list", getKategori);
router.post("/kategori-list", tambahKategori);
router.delete("/:id_kategori", hapusKategori);
router.put("/:id_kategori", perbaruiKategori);