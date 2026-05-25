const Pembayaran = require("../schema/pembayaran");
const Booking = require("../schema/booking");

// Ambil semua pembayaran (untuk admin/pengelola)
const findAll = async () => {
    return await Pembayaran.findAll({
        include: [{ model: Booking }],
    });
};

// Buat pembayaran baru
const create = async (data) => {
    return await Pembayaran.create(data);
};

// Cari pembayaran berdasarkan ID
const findById = async (id) => {
    return await Pembayaran.findByPk(id, {
        include: [{ model: Booking }],
    });
};

// Cari semua pembayaran milik satu booking
const findByBookingId = async (bookingId) => {
    return await Pembayaran.findAll({
        where: { bookingId },
    });
};

// Update status pembayaran (PENDING -> VERIFIED / REJECTED)
const updateById = async (id, data) => {
    await Pembayaran.update(data, { where: { id } });
    return await Pembayaran.findByPk(id);
};

// Hapus pembayaran
const deleteById = async (id) => {
    return await Pembayaran.destroy({ where: { id } });
};

module.exports = {
    findAll,
    create,
    findById,
    findByBookingId,
    updateById,
    deleteById,
};
