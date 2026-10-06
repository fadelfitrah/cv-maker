const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Catat transaksi baru
router.post("/", transactionController.createTransaction);

// Ambil semua transaksi (admin / rekap)
router.get("/", transactionController.getAllTransactions);

// Ambil riwayat transaksi milik user tertentu
router.get("/user/:userId", transactionController.getTransactionsByUser);

// Perbarui status transaksi (pending / paid / failed / cancelled)
router.patch("/:orderId/status", transactionController.updateTransactionStatus);

module.exports = router;
