const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");

/**
 * Registrasi User Baru
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter.",
      });
    }

    // Cek apakah email sudah terdaftar
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar. Silakan gunakan email lain atau login.",
      });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user ke tabel users dengan status default free
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, plan_status) VALUES (?, ?, ?, 'user', 'free')",
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    return res.status(201).json({
      success: true,
      message: "Registrasi pengguna berhasil.",
      data: {
        id: userId,
        name,
        email,
        role: "user",
        plan_status: "free",
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat registrasi.",
      error: error.message,
    });
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi.",
      });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password tidak sesuai.",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email atau password tidak sesuai.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan_status: user.plan_status || "free",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat login.",
      error: error.message,
    });
  }
};

/**
 * Ambil data user spesifik berdasarkan ID
 * GET /api/auth/user/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, name, email, role, plan_status, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data user.",
      error: error.message,
    });
  }
};

/**
 * Upgrade Plan User dari Free ke Pro (Berbayar)
 * POST /api/auth/upgrade-plan
 */
exports.upgradePlan = async (req, res) => {
  try {
    const { userId, planName = "Pro Membership Lifetime", amount = 49000, paymentMethod = "qris" } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID diperlukan untuk upgrade plan.",
      });
    }

    // Periksa user
    const [users] = await pool.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [userId]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan di database.",
      });
    }

    // 1. Update status plan user menjadi 'pro' di tabel users
    await pool.query("UPDATE users SET plan_status = 'pro', updated_at = NOW() WHERE id = ?", [userId]);

    // 2. Catat transaksi berhasil ke tabel transactions
    const orderId = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    await pool.query(
      `INSERT INTO transactions (
        user_id, order_id, plan_name, amount, currency,
        status, payment_method, payment_details
      ) VALUES (?, ?, ?, ?, 'IDR', 'paid', ?, ?)`,
      [
        userId,
        orderId,
        planName,
        amount,
        paymentMethod,
        JSON.stringify({ note: "Upgrade to Pro successfully processed", timestamp: new Date() }),
      ]
    );

    // Ambil user terbaru
    const [updatedUser] = await pool.query(
      "SELECT id, name, email, role, plan_status FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Selamat! Akun Anda berhasil diupgrade ke Paket Berbayar (Pro). Sekarang Anda dapat mendownload CV.",
      data: {
        user: updatedUser[0],
        orderId,
      },
    });
  } catch (error) {
    console.error("Upgrade Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengupgrade plan user.",
      error: error.message,
    });
  }
};

/**
 * Ambil daftar user
 * GET /api/auth/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email, role, plan_status, created_at, updated_at FROM users ORDER BY created_at DESC"
    );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data user.",
      error: error.message,
    });
  }
};
