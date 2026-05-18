// Memanggil file model/DAO yang baru saja kamu kirim
const userModel = require("../models/userModels");

// Mendapatkan semua user
const getAllUsers = async (req, res) => {
  try {
    // Memanggil fungsi findAll() dari userModels.js
    const allDataUser = await userModel.findAll();
    res.status(200).json({
      message: "Daftar pengguna futsal berhasil diambil",
      data: allDataUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data pengguna",
      error: error.message,
    });
  }
};

// Mendaftarkan user baru
const createUser = async (req, res) => {
  const { username, email, nomor_hp, role } = req.body;
  try {
    // Memanggil fungsi create() dari userModels.js
    const newUser = await userModel.create({
      username,
      email,
      nomor_hp,
      role: role || 'penyewa'
    });
    res.status(201).json({
      message: "Pendaftaran berhasil!",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Pendaftaran gagal",
      error: error.message,
    });
  }
};

// Melihat profil user berdasarkan ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    // PERBAIKAN: Gunakan findById(id), bukan findByPk(id)
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    res.status(200).json({ message: "Data ditemukan", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update profil
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, nomor_hp } = req.body;
  try {
    // PERBAIKAN: Gunakan updateById, bukan user.update
    const updatedUser = await userModel.updateById(id, { username, email, nomor_hp });

    if (!updatedUser) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    res.status(200).json({ message: "Profil diperbarui", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Gagal update", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // GANTI findByPk MENJADI findById sesuai nama fungsi di userModels.js kamu
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Pengguna tidak ditemukan",
      });
    }

    // GANTI user.destroy() MENJADI deleteById(id) agar lebih sinkron dengan modelmu
    await userModel.deleteById(id);

    res.status(200).json({
      message: "Akun pengguna berhasil dihapus dari sistem",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus pengguna",
      error: error.message, // Ini akan kasih tau detail kalau ada salah ketik lagi
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};