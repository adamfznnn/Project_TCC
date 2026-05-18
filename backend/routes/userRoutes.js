const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Endpoint untuk Pengelola (melihat semua member futsal)
router.get("/", userController.getAllUsers);

// Endpoint untuk profil pribadi (Penyewa melihat datanya sendiri)
router.get("/:id", userController.getUserById);

// Endpoint untuk registrasi akun baru (Penyewa baru daftar)
router.post("/register", userController.createUser);

// Endpoint untuk update profil (Ganti nama/nomor HP)
router.put("/update/:id", userController.updateUser);

// Endpoint untuk hapus akun atau blacklist user (Oleh Pengelola)
router.delete("/:id", userController.deleteUser);

module.exports = router;