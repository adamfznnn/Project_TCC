const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaranController");

// Penyewa: kirim bukti pembayaran
router.post("/", pembayaranController.createPembayaran);

// Admin: lihat semua pembayaran
router.get("/", pembayaranController.getAllPembayaran);

// Lihat pembayaran berdasarkan booking
router.get("/booking/:bookingId", pembayaranController.getPembayaranByBooking);

// Admin: verifikasi atau tolak pembayaran
router.put("/:id/status", pembayaranController.updateStatusPembayaran);

// Admin: hapus data pembayaran
router.delete("/:id", pembayaranController.deletePembayaran);

module.exports = router;
