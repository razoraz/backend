import express from "express";
import upload from "../middlewares/uploadCloudinary.js";
import {
  tambahKategori,
  hapusKategori,
  perbaruiKategori,
} from "../controllers/kelola-kategori.js";
  
import {
  addMenu,
  getKategori,
  getMenu,
  searchMenu,
  deleteMenu,
  updateMenu,
  getMenuByIdController,
} from "../controllers/kelola-menu.js";

const router = express.Router();

// ========================
// 🛣️ ROUTES
// ========================

// GET semua kategori
router.get("/kategori", getKategori);
router.post("/kategori", tambahKategori);
router.delete("/kategori/:id_kategori", hapusKategori);
router.put("/kategori/:id_kategori", perbaruiKategori);

// GET semua menu
router.get("/menu", getMenu);

// GET detail menu by id
router.get("/menu/:id", getMenuByIdController);

// GET pencarian menu (opsional)
router.get("/menu/search", searchMenu);

// POST tambah menu
router.post("/tambah", upload.single("gambar_menu"), addMenu);

// DELETE hapus menu
router.delete("/menu/:id", deleteMenu);

// PUT ubah menu
router.put("/menu/:id", upload.single("gambar_menu"), updateMenu);

export default router;
