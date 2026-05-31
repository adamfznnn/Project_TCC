const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Mendapatkan semua user
const getAllUsers = async (req, res) => {
  try {
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

// Registrasi user baru
const createUser = async (req, res) => {
  const { username, email, password, nomor_hp, role } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, dan password wajib diisi",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      nomor_hp,
      role: role || "penyewa",
    });

    res.status(201).json({
      message: "Pendaftaran berhasil!",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        nomor_hp: newUser.nomor_hp,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Pendaftaran gagal",
      error: error.message,
    });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nomor_hp: user.nomor_hp,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Login gagal",
      error: error.message,
    });
  }
};

// Melihat profil user berdasarkan ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    res.status(200).json({ message: "Data ditemukan", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update profil (+ opsional ganti password)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, nomor_hp, old_password, new_password } = req.body;
  try {
    const updatePayload = { username, email, nomor_hp };

    // Jika ada permintaan ganti password
    if (old_password && new_password) {
      // Ambil user lengkap dengan password untuk verifikasi
      const user = await userModel.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }

      // Verifikasi password lama
      const isOldValid = await bcrypt.compare(old_password, user.password);
      if (!isOldValid) {
        return res.status(401).json({ message: "Password lama tidak sesuai" });
      }

      // Hash password baru
      updatePayload.password = await bcrypt.hash(new_password, 10);
    }

    const updatedUser = await userModel.updateById(id, updatePayload);
    if (!updatedUser) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({
      message: old_password ? "Profil & password diperbarui" : "Profil diperbarui",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        nomor_hp: updatedUser.nomor_hp,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal update", error: error.message });
  }
};

// Hapus user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    await userModel.deleteById(id);
    res.status(200).json({ message: "Akun pengguna berhasil dihapus dari sistem" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pengguna", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  login,
  getUserById,
  updateUser,
  deleteUser,
};