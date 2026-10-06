const { pool } = require("../config/db");

/**
 * Buat transaksi baru
 * POST /api/transactions
 */
exports.createTransaction = async (req, res) => {
  try {
    const {
      userId,
      planName,
      amount,
      currency = "IDR",
      paymentMethod = "manual_transfer",
      paymentDetails = null,
    } = req.body;

    if (!userId || !planName || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID, nama paket (planName), dan amount wajib diisi.",
      });
    }

    // Pastikan user exists
    const [user] = await pool.query("SELECT id FROM users WHERE id = ? LIMIT 1", [userId]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    // Generate Order ID unik: misal CVM-TIMESTAMP-RANDOM
    const orderId = `CVM-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentDetailsStr = typeof paymentDetails === "object" && paymentDetails !== null
      ? JSON.stringify(paymentDetails)
      : paymentDetails;

    const [result] = await pool.query(
      `INSERT INTO transactions (
        user_id, order_id, plan_name, amount, currency,
        status, payment_method, payment_details
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        userId,
        orderId,
        planName,
        amount,
        currency,
        paymentMethod,
        paymentDetailsStr,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Transaksi berhasil dibuat.",
      data: {
        id: result.insertId,
        orderId,
        userId,
        planName,
        amount,
        currency,
        status: "pending",
        paymentMethod,
      },
    });
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat catatan transaksi.",
      error: error.message,
    });
  }
};

/**
 * Ambil riwayat transaksi berdasarkan user ID
 * GET /api/transactions/user/:userId
 */
exports.getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get User Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar transaksi.",
      error: error.message,
    });
  }
};

/**
 * Ambil semua transaksi (untuk admin dashboard / laporan)
 * GET /api/transactions
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get All Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil semua data transaksi.",
      error: error.message,
    });
  }
};

/**
 * Update status transaksi (misal: pending -> paid, failed, cancelled)
 * PATCH /api/transactions/:orderId/status
 */
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "paid", "failed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid. Pilihan: ${validStatuses.join(", ")}`,
      });
    }

    const [result] = await pool.query(
      "UPDATE transactions SET status = ?, updated_at = NOW() WHERE order_id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status transaksi berhasil diubah menjadi ${status}.`,
      data: {
        orderId,
        status,
      },
    });
  } catch (error) {
    console.error("Update Transaction Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui status transaksi.",
      error: error.message,
    });
  }
};
