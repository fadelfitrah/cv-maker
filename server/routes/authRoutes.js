const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Registrasi user baru
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Ambil info user spesifik (termasuk plan_status dari database)
router.get("/user/:id", authController.getUserById);

// Upgrade plan user (free -> pro) dan catat transaksi otomatis
router.post("/upgrade-plan", authController.upgradePlan);

// Daftar semua user
router.get("/users", authController.getAllUsers);

module.exports = router;
