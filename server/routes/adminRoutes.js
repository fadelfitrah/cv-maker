const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Overview statistik dashboard admin
router.get("/overview", adminController.getDashboardOverview);

// Manajemen Transaksi Admin
router.get("/transactions", adminController.getAllTransactions);
router.get("/transactions/pending", adminController.getPendingTransactions);
router.patch("/transactions/:orderId/approve", adminController.approveTransaction);
router.patch("/transactions/:orderId/reject", adminController.rejectTransaction);

// Manajemen User Admin
router.get("/users", adminController.getAllUsers);
router.patch("/users/:userId/plan", adminController.updateUserPlan);
router.patch("/users/:userId/role", adminController.updateUserRole);

module.exports = router;
