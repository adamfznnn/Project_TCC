const pembayaranModel = require("../models/pembayaranModels");
const bookingModel = require("../models/bookingModels");

// 1. Upload bukti pembayaran (oleh penyewa)
const createPembayaran = async (req, res) => {
    const { bookingId, jumlah_bayar, metode_pembayaran, bukti_transfer } = req.body;
    try {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }

        const pembayaran = await pembayaranModel.create({
            bookingId,
            jumlah_bayar,
            metode_pembayaran,
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

// 3. Ambil pembayaran berdasarkan bookingId
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

        const updated = await pembayaranModel.updateById(id, { status });

        // Jika VERIFIED, update status booking menjadi PAID_DP atau LUNAS
        if (status === "VERIFIED") {
            const booking = await bookingModel.findById(pembayaran.bookingId);
            if (booking) {
                const totalSudahBayar = pembayaran.jumlah_bayar;
                const newStatus = totalSudahBayar >= booking.total_harga ? "LUNAS" : "PAID_DP";
                await bookingModel.updateById(pembayaran.bookingId, { status_pembayaran: newStatus });
            }
        }

        res.status(200).json({ message: `Pembayaran berhasil di-${status.toLowerCase()}`, data: updated });
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
