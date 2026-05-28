const bookingModel = require("../models/bookingModels");
const lapanganModel = require("../models/lapanganModels");
const redisClient = require("../config/redis");
const { Op } = require("sequelize");

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
        
        // PERBAIKAN: Mengubah 'PENDING_PAYMENT' menjadi 'PENDING'
        const newBooking = await bookingModel.create({
            userId,
            lapanganId,
            tanggal,
            jam_mulai,
            jam_selesai,
            total_harga,
            status_pembayaran: 'PENDING' 
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
const confirmPayment = async (req, res) => {
    const { bookingId } = req.params;
    const { jumlah_dp, bukti_transfer } = req.body;
    try {
        const booking = await bookingModel.findByPk(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking tidak ditemukan" });
        await booking.update({
            status_pembayaran: 'PAID_DP',
            keterangan: `DP dibayar: ${jumlah_dp}`
        });
        await redisClient.del(`lock:booking:${bookingId}`);
        res.status(200).json({ message: "DP Berhasil dikonfirmasi", data: booking });
    } catch (error) {
        res.status(500).json({ message: "Gagal konfirmasi pembayaran", error: error.message });
    }
};

// 4. Ambil Booking Milik User
const getBookingsByUser = async (req, res) => {
    const { userId } = req.query;
    try {
        if (!userId) {
            return res.status(400).json({ message: "userId wajib diisi" });
        }
        const bookings = await bookingModel.findAll({ where: { userId } });  
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