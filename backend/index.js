// Import Package dan File
const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config(); // Pastikan dotenv dipanggil paling atas

// Import Routes
const userRoutes = require("./routes/userRoutes");
const lapanganRoutes = require("./routes/lapanganRoutes"); // Tambahkan ini
const bookingRoutes = require("./routes/bookingRoutes");   // Tambahkan ini

// Inisialisasi Express
const app = express();

// Konfigurasi CORS
app.use(cors({
  origin: ['http://localhost', 'http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Route dasar untuk testing
app.get("/", (req, res) => {
  res.send("Backend Booking Futsal API is Running!");
});

// Import Schemas & Relations (Penting agar tabel otomatis terbuat di GCP)
const User = require("./schema/User");
const Lapangan = require("./schema/Lapangan");
const Booking = require("./schema/Booking");

// Setting API Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/lapangan", lapanganRoutes); // Endpoint untuk daftar lapangan
app.use("/api/v1/booking", bookingRoutes);   // Endpoint untuk transaksi booking

// Sinkronisasi Database dan Jalankan Server
const port = process.env.PORT || 3000;

// Gunakan alter: true agar jika kamu tambah kolom di VS Code, 
// database di MariaDB GCP otomatis terupdate tanpa hapus data.
sequelize.sync({ alter: true }).then(() => {
  console.log("------------------------------------------");
  console.log("✅ Database MariaDB GCP Synced");
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log("------------------------------------------");
  });
}).catch(err => {
  console.error("❌ Unable to connect to GCP Database:", err);
});