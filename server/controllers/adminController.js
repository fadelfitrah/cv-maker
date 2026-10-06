const { pool } = require("../config/db");

/**
 * Ringkasan statistik untuk Admin Dashboard
 * GET /api/admin/overview
 */
exports.getDashboardOverview = async (req, res) => {
  try {
    // 1. Hitung statistik user
    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN plan_status = 'free' THEN 1 ELSE 0 END) as free_users,
        SUM(CASE WHEN plan_status = 'pro' THEN 1 ELSE 0 END) as pro_users,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users
      FROM users
    `);

    // 2. Hitung statistik transaksi
    const [trxStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_transactions,
        SUM(CASE WHEN status = 'failed' OR status = 'cancelled' THEN 1 ELSE 0 END) as failed_transactions,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as total_revenue
      FROM transactions
    `);

    // 3. Transaksi terbaru (5 data)
    const [recentTransactions] = await pool.query(`
      SELECT 
        t.id, t.order_id, t.plan_name, t.amount, t.currency, t.status, 
        t.payment_method, t.payment_details, t.payment_proof, t.admin_notes, t.created_at,
        u.id as user_id, u.name as user_name, u.email as user_email, u.plan_status as current_user_plan
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    // 4. User yang baru mendaftar (5 data)
    const [recentUsers] = await pool.query(`
      SELECT id, name, email, role, plan_status, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: Number(userStats[0]?.total_users || 0),
          free: Number(userStats[0]?.free_users || 0),
          pro: Number(userStats[0]?.pro_users || 0),
          admin: Number(userStats[0]?.admin_users || 0),
        },
        transactions: {
          total: Number(trxStats[0]?.total_transactions || 0),
          pending: Number(trxStats[0]?.pending_transactions || 0),
          paid: Number(trxStats[0]?.paid_transactions || 0),
          failed: Number(trxStats[0]?.failed_transactions || 0),
          revenue: Number(trxStats[0]?.total_revenue || 0),
        },
        recentTransactions,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Admin Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memuat ringkasan data admin.",
      error: error.message,
    });
  }
};

/**
 * Ambil semua transaksi dengan filter dan pencarian
 * GET /api/admin/transactions
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT 
        t.id, t.order_id, t.plan_name, t.amount, t.currency, t.status, 
        t.payment_method, t.payment_details, t.payment_proof, t.admin_notes, t.created_at, t.updated_at,
        u.id as user_id, u.name as user_name, u.email as user_email, u.plan_status as current_user_plan
      FROM transactions t
      JOIN users u ON t.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (status && status !== "all") {
      conditions.push("t.status = ?");
      params.push(status);
    }

    if (search && search.trim() !== "") {
      conditions.push("(t.order_id LIKE ? OR u.name LIKE ? OR u.email LIKE ?)");
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY t.created_at DESC";

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Admin Get Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data transaksi admin.",
      error: error.message,
    });
  }
};

/**
 * Ambil daftar transaksi yang menunggu ACC admin (Pending)
 * GET /api/admin/transactions/pending
 */
exports.getPendingTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id, t.order_id, t.plan_name, t.amount, t.currency, t.status, 
        t.payment_method, t.payment_details, t.payment_proof, t.admin_notes, t.created_at,
        u.id as user_id, u.name as user_name, u.email as user_email, u.plan_status as current_user_plan
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'pending'
      ORDER BY t.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Admin Get Pending Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memuat transaksi pending.",
      error: error.message,
    });
  }
};

/**
 * ACC / Setujui Transaksi Pembayaran:
 * Mengubah status transaksi menjadi 'paid' DAN MENGUBAH STATUS PLAN USER MENJADI 'pro'
 * PATCH /api/admin/transactions/:orderId/approve
 */
exports.approveTransaction = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { orderId } = req.params;
    const { adminNotes = "Pembayaran telah dicek & disetujui oleh Admin (ACC)." } = req.body;

    await connection.beginTransaction();

    // 1. Ambil transaksi
    const [trx] = await connection.query(
      "SELECT id, user_id, status, plan_name FROM transactions WHERE order_id = ? LIMIT 1 FOR UPDATE",
      [orderId]
    );

    if (trx.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    const transaction = trx[0];
    const userId = transaction.user_id;

    // 2. Update status transaksi menjadi 'paid'
    await connection.query(
      `UPDATE transactions 
       SET status = 'paid', admin_notes = ?, updated_at = NOW() 
       WHERE order_id = ?`,
      [adminNotes, orderId]
    );

    // 3. Ubah status user dari free menjadi 'pro'
    await connection.query(
      `UPDATE users 
       SET plan_status = 'pro', updated_at = NOW() 
       WHERE id = ?`,
      [userId]
    );

    await connection.commit();

    // Ambil data user terkini
    const [updatedUser] = await pool.query(
      "SELECT id, name, email, role, plan_status FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: `Transaksi ${orderId} berhasil di-ACC! Status pengguna ${updatedUser[0]?.name || ''} kini telah aktif sebagai mode PRO.`,
      data: {
        orderId,
        status: "paid",
        user: updatedUser[0],
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Approve Transaction Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menyetujui transaksi.",
      error: error.message,
    });
  } finally {
    connection.release();
  }
};

/**
 * Tolak Transaksi Pembayaran:
 * Mengubah status transaksi menjadi 'failed' / 'cancelled', user tetap dalam status free
 * PATCH /api/admin/transactions/:orderId/reject
 */
exports.rejectTransaction = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason = "Bukti pembayaran tidak sesuai atau tidak valid." } = req.body;

    const [trx] = await pool.query(
      "SELECT id, user_id, status FROM transactions WHERE order_id = ? LIMIT 1",
      [orderId]
    );

    if (trx.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan.",
      });
    }

    await pool.query(
      `UPDATE transactions 
       SET status = 'failed', admin_notes = ?, updated_at = NOW() 
       WHERE order_id = ?`,
      [reason, orderId]
    );

    return res.status(200).json({
      success: true,
      message: `Transaksi ${orderId} telah ditolak. Status user tetap mode Free.`,
      data: {
        orderId,
        status: "failed",
        reason,
      },
    });
  } catch (error) {
    console.error("Reject Transaction Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menolak transaksi.",
      error: error.message,
    });
  }
};

/**
 * Ambil semua user dengan ringkasan CV dan transaksi
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, plan } = req.query;

    let query = `
      SELECT 
        u.id, u.name, u.email, u.role, u.plan_status, u.created_at, u.updated_at,
        COUNT(DISTINCT c.id) as cv_count,
        COUNT(DISTINCT t.id) as trx_count,
        MAX(t.created_at) as last_trx_date
      FROM users u
      LEFT JOIN cv_profiles c ON u.id = c.user_id
      LEFT JOIN transactions t ON u.id = t.user_id
    `;
    const params = [];
    const conditions = [];

    if (plan && plan !== "all") {
      conditions.push("u.plan_status = ?");
      params.push(plan);
    }

    if (search && search.trim() !== "") {
      conditions.push("(u.name LIKE ? OR u.email LIKE ?)");
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY u.id ORDER BY u.created_at DESC";

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Admin Get Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar pengguna admin.",
      error: error.message,
    });
  }
};

/**
 * Ubah manual status Plan User (Checklist Free <-> Pro)
 * PATCH /api/admin/users/:userId/plan
 */
exports.updateUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { planStatus } = req.body;

    if (!["free", "pro"].includes(planStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status plan hanya boleh 'free' atau 'pro'.",
      });
    }

    const [user] = await pool.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [userId]);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    await pool.query(
      "UPDATE users SET plan_status = ?, updated_at = NOW() WHERE id = ?",
      [planStatus, userId]
    );

    return res.status(200).json({
      success: true,
      message: `Status plan untuk user ${user[0].name} berhasil diubah menjadi ${planStatus.toUpperCase()}.`,
      data: {
        userId: Number(userId),
        planStatus,
      },
    });
  } catch (error) {
    console.error("Update User Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengubah status plan user.",
      error: error.message,
    });
  }
};

/**
 * Ubah role user (user <-> admin)
 * PATCH /api/admin/users/:userId/role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role hanya boleh 'user' atau 'admin'.",
      });
    }

    await pool.query("UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?", [role, userId]);

    return res.status(200).json({
      success: true,
      message: `Role user berhasil diubah menjadi ${role}.`,
      data: {
        userId: Number(userId),
        role,
      },
    });
  } catch (error) {
    console.error("Update User Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengubah role user.",
      error: error.message,
    });
  }
};
