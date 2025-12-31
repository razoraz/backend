import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { initRoutes } from "./src/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Tes endpoint
app.get("/", (req, res) => {
  res.send("Backend menu berjalan 🚀");
});

// Jalankan semua route dari index.js
initRoutes(app);

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
