const express = require("express");
const router = express.Router();
const lapanganController = require("../controllers/lapanganController");

router.get("/", lapanganController.getAllLapangan); // Dilihat Penyewa & Pengelola
router.post("/", lapanganController.createLapangan); // Hanya Pengelola
router.put("/:id", lapanganController.updateLapangan);
router.delete("/:id", lapanganController.deleteLapangan);

module.exports = router;