const Lapangan = require("../schema/Lapangan");

// Ambil semua daftar lapangan (untuk ditampilkan di Mobile/Web)
const findAll = async () => {
    return await Lapangan.findAll({
        attributes: ["id", "nama_lapangan", "jenis_rumput", "harga_per_jam"],
    });
};

// Tambah lapangan baru (Fungsi Pengelola/Admin)
const create = async (lapanganData) => {
    return await Lapangan.create(lapanganData);
};

// Cari detail lapangan berdasarkan ID
const findById = async (id) => {
    return await Lapangan.findByPk(id);
};

// Update data lapangan (misal: harga naik atau ganti rumput)
const updateById = async (id, lapanganData) => {
    await Lapangan.update(lapanganData, {
        where: { id: id },
    });
    return await Lapangan.findByPk(id);
};

// Hapus lapangan dari sistem
const deleteById = async (id) => {
    return await Lapangan.destroy({
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