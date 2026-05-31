const pembayaranModel = require("../models/pembayaranModels");
const bookingModel = require("../models/bookingModels");
const Pembayaran = require("../schema/pembayaran");

// 1. Upload bukti pembayaran (oleh penyewa)
// Dipakai jika ingin alur: penyewa submit → admin verifikasi
// Body: { bookingId, jumlah_bayar, metode_pembayaran, bukti_transfer }
const createPembayaran = async (req, res) => {
    const { bookingId, jumlah_bayar, metode_pembayaran, bukti_transfer } = req.body;
    try {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        if (booking.status_pembayaran === "CANCELLED") {
            return res.status(400).json({ message: "Booking sudah dibatalkan" });
        }
        if (booking.status_pembayaran === "LUNAS") {
            return res.status(400).json({ message: "Booking sudah lunas, tidak perlu bayar lagi" });
        }

        const pembayaran = await pembayaranModel.create({
            bookingId,
            jumlah_bayar,
            metode_pembayaran: metode_pembayaran || "TRANSFER",
            bukti_transfer: bukti_transfer || null,
            status: "PENDING",
            tanggal_bayar: new Date(),
        });

        res.status(201).json({
            message: "Bukti pembayaran berhasil dikirim, menunggu verifikasi",
            data: pembayaran,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat pembayaran", error: error.message });
    }
};

// 2. Ambil semua pembayaran (admin)
const getAllPembayaran = async (req, res) => {
    try {
        const data = await pembayaranModel.findAll();
        res.status(200).json({ message: "OK", data });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data pembayaran", error: error.message });
    }
};

// 3. Ambil riwayat pembayaran berdasarkan bookingId
// Dipakai Flutter untuk menampilkan riwayat transaksi per booking
const getPembayaranByBooking = async (req, res) => {
    const { bookingId } = req.params;
    try {
        const data = await pembayaranModel.findByBookingId(bookingId);
        res.status(200).json({ message: "OK", data });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
};

// 4. Verifikasi / Tolak pembayaran (admin)
// FIX: Akumulasi semua pembayaran VERIFIED sebelum update status booking
const updateStatusPembayaran = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // "VERIFIED" atau "REJECTED"
    try {
        if (!["VERIFIED", "REJECTED"].includes(status)) {
            return res.status(400).json({ message: "Status tidak valid. Gunakan VERIFIED atau REJECTED" });
        }

        const pembayaran = await pembayaranModel.findById(id);
        if (!pembayaran) {
            return res.status(404).json({ message: "Data pembayaran tidak ditemukan" });
        }
        if (pembayaran.status !== "PENDING") {
            return res.status(400).json({ message: `Pembayaran sudah berstatus ${pembayaran.status}` });
        }

        const updated = await pembayaranModel.updateById(id, { status });

        if (status === "VERIFIED") {
            const booking = await bookingModel.findById(pembayaran.bookingId);
            if (booking) {
                // Hitung total semua pembayaran VERIFIED untuk booking ini (termasuk yang baru)
                const allVerified = await Pembayaran.findAll({
                    where: { bookingId: pembayaran.bookingId, status: "VERIFIED" }
                });
                const totalBayar = allVerified.reduce((sum, p) => sum + p.jumlah_bayar, 0);
                const newStatus = totalBayar >= booking.total_harga ? "LUNAS" : "PAID_DP";
                await bookingModel.updateById(pembayaran.bookingId, { status_pembayaran: newStatus });
            }
        }

        res.status(200).json({
            message: `Pembayaran berhasil di-${status.toLowerCase()}`,
            data: updated
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal update status pembayaran", error: error.message });
    }
};

// 5. Hapus pembayaran
const deletePembayaran = async (req, res) => {
    const { id } = req.params;
    try {
        await pembayaranModel.deleteById(id);
        res.status(200).json({ message: "Pembayaran berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus pembayaran", error: error.message });
    }
};

module.exports = {
    createPembayaran,
    getAllPembayaran,
    getPembayaranByBooking,
    updateStatusPembayaran,
    deletePembayaran,
};