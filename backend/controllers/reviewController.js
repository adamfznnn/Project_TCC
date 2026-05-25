const reviewModel = require("../models/reviewModels");
const bookingModel = require("../models/bookingModels");

// 1. Buat review baru (penyewa)
const createReview = async (req, res) => {
    const { bookingId, userId, lapanganId, rating, komentar } = req.body;
    try {
        // Cek booking ada dan milik user ini
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        if (booking.userId !== userId) {
            return res.status(403).json({ message: "Kamu tidak berhak mereview booking ini" });
        }
        // Hanya booking yang sudah LUNAS yang boleh direview
        if (booking.status_pembayaran !== "LUNAS") {
            return res.status(400).json({ message: "Review hanya bisa diberikan setelah pembayaran lunas" });
        }

        // Cek sudah pernah review atau belum (1 booking = 1 review)
        const existing = await reviewModel.findByBookingId(bookingId);
        if (existing) {
            return res.status(400).json({ message: "Kamu sudah memberikan review untuk booking ini" });
        }

        const review = await reviewModel.create({ bookingId, userId, lapanganId, rating, komentar });
        res.status(201).json({ message: "Review berhasil dikirim", data: review });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat review", error: error.message });
    }
};

// 2. Ambil semua review (publik / admin)
const getAllReview = async (req, res) => {
    try {
        const data = await reviewModel.findAll();
        res.status(200).json({ message: "OK", data });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil review", error: error.message });
    }
};

// 3. Ambil review berdasarkan lapangan
const getReviewByLapangan = async (req, res) => {
    const { lapanganId } = req.params;
    try {
        const data = await reviewModel.findByLapanganId(lapanganId);
        res.status(200).json({ message: "OK", data });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil review lapangan", error: error.message });
    }
};

// 4. Hapus review (admin)
const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await reviewModel.deleteById(id);
        res.status(200).json({ message: "Review berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus review", error: error.message });
    }
};

module.exports = {
    createReview,
    getAllReview,
    getReviewByLapangan,
    deleteReview,
};
