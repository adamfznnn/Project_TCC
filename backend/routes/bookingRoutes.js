const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
router.get("/", bookingController.getBookingsByUser);

router.get("/check", bookingController.checkAvailability); // Cek ketersediaan via Redis
router.post("/create", bookingController.createBooking); // Buat pesanan (Anti-bentrok)
router.put("/confirm/:bookingId", bookingController.confirmPayment); // Verifikasi DP

module.exports = router;