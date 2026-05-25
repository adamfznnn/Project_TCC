const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Penyewa: buat review
router.post("/", reviewController.createReview);

// Publik: lihat semua review
router.get("/", reviewController.getAllReview);

// Publik: lihat review per lapangan
router.get("/lapangan/:lapanganId", reviewController.getReviewByLapangan);

// Admin: hapus review
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
