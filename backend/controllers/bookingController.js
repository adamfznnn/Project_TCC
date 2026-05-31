const bookingModel = require("../models/bookingModels");
const pembayaranModel = require("../models/pembayaranModels");
const redisClient = require("../config/redis");
const { Op } = require("sequelize");
const Lapangan = require("../schema/lapangan");
const User = require("../schema/User");
const Booking = require("../schema/booking");

// 1. Cek Jadwal Kosong
const checkAvailability = async (req, res) => {
    const { lapanganId, tanggal } = req.query;
    const cacheKey = `jadwal:${lapanganId}:${tanggal}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                message: "Data jadwal (dari cache)",
                data: JSON.parse(cachedData)
            });
        }
        const bookings = await bookingModel.findAll({
            where: { lapanganId, tanggal }
        });
        await redisClient.setEx(cacheKey, 600, JSON.stringify(bookings));
        res.status(200).json({
            message: "Data jadwal berhasil diambil",
            data: bookings
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengecek jadwal", error: error.message });
    }
};

// 2. Membuat Pesanan Baru (Anti-Bentrok)
const createBooking = async (req, res) => {
    const { userId, lapanganId, tanggal, jam_mulai, jam_selesai, total_harga } = req.body;
    try {
        const isOccupied = await bookingModel.findOne({
            where: {
                lapanganId,
                tanggal,
                [Op.or]: [
                    { jam_mulai: { [Op.between]: [jam_mulai, jam_selesai] } },
                    { jam_selesai: { [Op.between]: [jam_mulai, jam_selesai] } }
                ]
            }
        });
        if (isOccupied) {
            return res.status(400).json({ message: "Jadwal sudah dipesan oleh orang lain!" });
        }

        const newBooking = await bookingModel.create({
            userId,
            lapanganId,
            tanggal,
            jam_mulai,
            jam_selesai,
            total_harga,
            status_pembayaran: "PENDING"
        });

        const lockKey = `lock:booking:${newBooking.id}`;
        await redisClient.setEx(lockKey, 900, "waiting_for_dp");
        await redisClient.del(`jadwal:${lapanganId}:${tanggal}`);

        res.status(201).json({
            message: "Booking berhasil dibuat, silakan bayar DP dalam 15 menit",
            data: newBooking
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal membuat booking", error: error.message });
    }
};

// 3. Konfirmasi Pembayaran DP
// FIX: Sekarang juga mencatat transaksi ke tabel Pembayaran sebagai riwayat
// Request body: { jumlah_dp, bukti_transfer (string base64/url), metode_pembayaran }
const confirmPayment = async (req, res) => {
    const { bookingId } = req.params;
    const { jumlah_dp, bukti_transfer, metode_pembayaran } = req.body;
    try {
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking tidak ditemukan" });
        }
        if (booking.status_pembayaran !== "PENDING") {
            return res.status(400).json({
                message: `Booking sudah berstatus ${booking.status_pembayaran}, tidak bisa konfirmasi ulang`
            });
        }

        // 1. Update status Booking → PAID_DP
        await booking.update({
            status_pembayaran: "PAID_DP",
            bukti_transfer: bukti_transfer || null,
        });

        // 2. Catat ke tabel Pembayaran sebagai riwayat transaksi
        await pembayaranModel.create({
            bookingId: booking.id,
            jumlah_bayar: jumlah_dp,
            metode_pembayaran: metode_pembayaran || "TRANSFER",
            bukti_transfer: bukti_transfer || null,
            status: "VERIFIED", // Langsung verified karena penyewa yang konfirmasi manual
            tanggal_bayar: new Date(),
        });

        // 3. Hapus Redis lock dan cache jadwal
        await redisClient.del(`lock:booking:${bookingId}`);
        await redisClient.del(`jadwal:${booking.lapanganId}:${booking.tanggal}`);

        res.status(200).json({
            message: "DP berhasil dikonfirmasi dan riwayat pembayaran tersimpan",
            data: booking
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal konfirmasi pembayaran", error: error.message });
    }
};

// 4. Ambil Booking Milik User
// FIX: Include Lapangan agar nama lapangan tampil di Flutter
const getBookingsByUser = async (req, res) => {
    const { userId } = req.query;
    try {
        if (!userId) {
            return res.status(400).json({ message: "userId wajib diisi" });
        }

        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                {
                    model: Lapangan,
                    attributes: ["id", "nama_lapangan", "jenis_rumput", "harga_per_jam"]
                },
                {
                    model: User,
                    attributes: ["id", "username", "email"]
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({ message: "OK", data: bookings });
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data", error: err.message });
    }
};

module.exports = {
    checkAvailability,
    createBooking,
    confirmPayment,
    getBookingsByUser,
};