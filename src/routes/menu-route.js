import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
// 📁 Konfigurasi Upload
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const name = path.basename(file.originalname, ext); 
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});


const upload = multer({ storage });

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
