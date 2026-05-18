const lapanganModel = require("../models/lapanganModels");
const redisClient = require("../config/redis");

// 1. Ambil semua lapangan (Untuk Penyewa & Pengelola)
const getAllLapangan = async (req, res) => {
    const cacheKey = "all_lapangan";

    try {
        // Cek di Redis (NoSQL) untuk status ketersediaan cepat
        const cachedLapangan = await redisClient.get(cacheKey);
        if (cachedLapangan) {
            return res.status(200).json({
                message: "Daftar lapangan (dari cache)",
                data: JSON.parse(cachedLapangan),
            });
        }

        // Jika tidak ada di cache, ambil dari SQL
        const allLapangan = await lapanganModel.findAll();

        // Simpan ke Redis selama 1 jam (3600 detik)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(allLapangan));

        res.status(200).json({
            message: "Daftar lapangan berhasil diambil",
            data: allLapangan,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data lapangan",
            error: error.message,
        });
    }
};

// 2. Tambah lapangan baru (Hanya Pengelola/Web)
const createLapangan = async (req, res) => {
    const { nama_lapangan, jenis_rumput, harga_per_jam } = req.body;

    try {
        const newLapangan = await lapanganModel.create({
            nama_lapangan,
            jenis_rumput,
            harga_per_jam,
        });

        // Hapus cache lama agar data baru muncul
        await redisClient.del("all_lapangan");

        res.status(201).json({
            message: "Lapangan baru berhasil ditambahkan",
            data: newLapangan,
        });
    } catch (error) {
        res.status(400).json({
            message: "Gagal menambahkan lapangan",
            error: error.message,
        });
    }
};

// 3. Update data lapangan (Misal ganti harga per jam)
const updateLapangan = async (req, res) => {
    const { id } = req.params;
    const { nama_lapangan, jenis_rumput, harga_per_jam } = req.body;

    try {
        const lapangan = await lapanganModel.findByPk(id);
        if (!lapangan) {
            return res.status(404).json({ message: "Lapangan tidak ditemukan" });
        }

        await lapangan.update({ nama_lapangan, jenis_rumput, harga_per_jam });

        // Invalidate cache
        await redisClient.del("all_lapangan");

        res.status(200).json({
            message: "Data lapangan berhasil diperbarui",
            data: lapangan,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal memperbarui lapangan",
            error: error.message,
        });
    }
};

// 4. Hapus lapangan
const deleteLapangan = async (req, res) => {
    const { id } = req.params;

    try {
        const lapangan = await lapanganModel.findByPk(id);
        if (!lapangan) {
            return res.status(404).json({ message: "Lapangan tidak ditemukan" });
        }

        await lapangan.destroy();
        await redisClient.del("all_lapangan");

        res.status(200).json({
            message: "Lapangan berhasil dihapus dari sistem",
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus lapangan",
            error: error.message,
        });
    }
};

module.exports = {
    getAllLapangan,
    createLapangan,
    updateLapangan,
    deleteLapangan,
};