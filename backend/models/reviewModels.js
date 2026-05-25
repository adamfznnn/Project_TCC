const Review = require("../schema/review");
const User = require("../schema/User");
const Lapangan = require("../schema/lapangan");
const Booking = require("../schema/booking");

// Ambil semua review (dengan info user & lapangan)
const findAll = async () => {
    return await Review.findAll({
        include: [
            { model: User, attributes: ["username"] },
            { model: Lapangan, attributes: ["nama_lapangan"] },
        ],
    });
};

// Ambil review berdasarkan lapangan tertentu
const findByLapanganId = async (lapanganId) => {
    return await Review.findAll({
        where: { lapanganId },
        include: [{ model: User, attributes: ["username"] }],
    });
};

// Buat review baru
const create = async (data) => {
    return await Review.create(data);
};

// Cari review berdasarkan ID
const findById = async (id) => {
    return await Review.findByPk(id, {
        include: [
            { model: User, attributes: ["username"] },
            { model: Lapangan, attributes: ["nama_lapangan"] },
        ],
    });
};

// Cek apakah booking sudah pernah direview
const findByBookingId = async (bookingId) => {
    return await Review.findOne({ where: { bookingId } });
};

// Hapus review
const deleteById = async (id) => {
    return await Review.destroy({ where: { id } });
};

module.exports = {
    findAll,
    findByLapanganId,
    create,
    findById,
    findByBookingId,
    deleteById,
};
