const Booking = require("../schema/booking");
const User = require("../schema/User");
const Lapangan = require("../schema/lapangan");

// Ambil semua booking — menerima options agar bisa difilter (misal: { where: { lapanganId, tanggal } })
const findAll = async (options = {}) => {
    return await Booking.findAll({
        include: [
            { model: User, attributes: ["username", "nomor_hp"] },
            { model: Lapangan, attributes: ["nama_lapangan"] }
        ],
        ...options,
    });
};

// Buat pesanan baru
const create = async (bookingData) => {
    return await Booking.create(bookingData);
};

// Cari satu booking berdasarkan PK (dengan relasi lengkap)
const findById = async (id) => {
    return await Booking.findByPk(id, {
        include: [
            { model: User, attributes: ["id", "username", "email", "nomor_hp"] },
            { model: Lapangan, attributes: ["id", "nama_lapangan", "jenis_rumput", "harga_per_jam"] },
        ]
    });
};

// Cari satu booking berdasarkan kondisi (cek slot bentrok)
const findOne = async (options) => {
    return await Booking.findOne(options);
};

// Update status booking
const updateById = async (id, bookingData) => {
    await Booking.update(bookingData, { where: { id } });
    return await Booking.findByPk(id);
};

// Hapus booking
const deleteById = async (id) => {
    return await Booking.destroy({ where: { id } });
};

module.exports = {
    findAll,
    create,
    findById,
    findOne,
    updateById,
    deleteById,
};