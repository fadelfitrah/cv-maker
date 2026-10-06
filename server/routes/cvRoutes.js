const express = require("express");
const router = express.Router();
const cvController = require("../controllers/cvController");

// Ambil CV aktif/utama milik user
router.get("/user-active/:userId", cvController.getUserActiveCv);

// Simpan atau Auto-save CV aktif milik user ke database MySQL
router.put("/user-active/:userId", cvController.saveUserActiveCv);
router.post("/user-active/:userId", cvController.saveUserActiveCv);

// Simpan CV baru beserta data pribadi
router.post("/", cvController.createCv);

// Update CV & data pribadi
router.put("/:id", cvController.updateCv);

// Ambil CV spesifik berdasarkan ID CV
router.get("/:id", cvController.getCvById);

// Ambil semua CV milik user tertentu
router.get("/user/:userId", cvController.getCvsByUser);

// Hapus CV
router.delete("/:id", cvController.deleteCv);

module.exports = router;
