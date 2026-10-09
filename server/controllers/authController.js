const bcrypt = require("bcryptjs");
const { pool } = require("../config/db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

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
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Email sudah terdaftar. Silakan gunakan email lain atau login.",
      });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan user ke tabel users dengan status default free
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role, plan_status) VALUES (?, ?, ?, 'user', 'free')",
      [name, email, hashedPassword],
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

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );
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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      token,
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
      [id],
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
 * Pengajuan Upgrade Plan User dari Free ke Pro (Menunggu ACC Admin)
 * POST /api/auth/upgrade-plan
 * Aturan: Sistem TIDAK MENGUBAH STATUS USER SECARA OTOMATIS.
 * Sistem hanya mencatat transaksi 'pending' dan mengirim notifikasi ke admin,
 * serta meminta user menunggu persetujuan/ACC dari admin.
 */
exports.upgradePlan = async (req, res) => {
  try {
    const {
      userId,
      planName = "Pro Membership Lifetime",
      amount = 49000,
      paymentMethod = "qris",
      paymentDetails = null,
      paymentProof = null,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID diperlukan untuk pengajuan upgrade plan.",
      });
    }

    // Periksa user
    const [users] = await pool.query(
      "SELECT id, name, email, role, plan_status FROM users WHERE id = ? LIMIT 1",
      [userId],
    );
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan di database.",
      });
    }

    const currentUser = users[0];

    // Cek jika user sudah pro
    if (currentUser.plan_status === "pro") {
      return res.status(400).json({
        success: false,
        message: "Akun Anda sudah berstatus Pro.",
      });
    }

    // Cek apakah ada transaksi pending sebelumnya yang belum di-ACC
    const [pendingTrx] = await pool.query(
      "SELECT id, order_id FROM transactions WHERE user_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1",
      [userId],
    );

    // Buat order ID unik
    const orderId = `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const detailsStr =
      typeof paymentDetails === "object" && paymentDetails !== null
        ? JSON.stringify(paymentDetails)
        : paymentDetails ||
          JSON.stringify({
            note: "Pengajuan upgrade menunggu ACC admin",
            date: new Date().toISOString(),
          });

    // Catat transaksi berstatus 'pending' (MENUNGGU ACC ADMIN)
    // PENTING: Jangan ubah tabel users! Status user tetap 'free'
    await pool.query(
      `INSERT INTO transactions (
        user_id, order_id, plan_name, amount, currency,
        status, payment_method, payment_details, payment_proof
      ) VALUES (?, ?, ?, ?, 'IDR', 'pending', ?, ?, ?)`,
      [
        userId,
        orderId,
        planName,
        amount,
        paymentMethod,
        detailsStr,
        paymentProof,
      ],
    );

    return res.status(200).json({
      success: true,
      requiresAdminApproval: true,
      message:
        "Permintaan upgrade ke mode Pro berhasil diajukan! Silakan tunggu pengecekan pembayaran dan ACC dari Admin. Status akun Anda akan aktif setelah disetujui.",
      data: {
        user: currentUser, // user tetap free
        orderId,
        status: "pending",
        hasExistingPending: pendingTrx.length > 0,
      },
    });
  } catch (error) {
    console.error("Upgrade Plan Request Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengajukan upgrade plan.",
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
      "SELECT id, name, email, role, plan_status, created_at, updated_at FROM users ORDER BY created_at DESC",
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
