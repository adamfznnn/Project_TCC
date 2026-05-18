const Booking = require("../schema/Booking");
const User = require("../schema/User");
const Lapangan = require("../schema/Lapangan");

// Ambil semua data booking (untuk laporan pengelola)
const findAll = async () => {
    return await Booking.findAll({
        include: [
            { model: User, attributes: ["username", "nomor_hp"] },
            { model: Lapangan, attributes: ["nama_lapangan"] }
        ],
    });
};

// Fungsi utama: Membuat pesanan (digunakan di bookingController)
const create = async (bookingData) => {
    return await Booking.create(bookingData);
};

// Cari satu data booking (untuk verifikasi pembayaran DP)
const findById = async (id) => {
    return await Booking.findByPk(id, {
        include: [User, Lapangan]
    });
};

// Update status (misal dari PENDING ke PAID_DP setelah bukti transfer dicek)
const updateById = async (id, bookingData) => {
    await Booking.update(bookingData, {
        where: { id: id },
    });
    return await Booking.findByPk(id);
};

// Hapus booking (jika dibatalkan atau tidak bayar DP dalam batas waktu)
const deleteById = async (id) => {
    return await Booking.destroy({
        where: { id: id },
    });
};

module.exports = {
    findAll,
    create,
    findById,
    updateById,
    deleteById,
};