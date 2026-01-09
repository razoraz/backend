import express from "express";

  
import {
  getKategori,
  getMenu,
  searchMenu,
  getMenuByIdController,
} from "../controllers/kelola-menu.js";

const router = express.Router();

// ========================
// 🛣️ ROUTES
// ========================

// GET semua kategori
router.get("/kategori", getKategori);

// GET semua menu
router.get("/daftar-menu", getMenu);

// GET detail menu by id
router.get("/daftar-menu/:id", getMenuByIdController);

// GET pencarian menu (opsional)
router.get("/daftar-menu/search", searchMenu);

export default router;
