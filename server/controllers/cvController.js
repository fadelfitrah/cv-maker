const { pool } = require("../config/db");

/**
 * Simpan atau Buat CV baru untuk user
 * POST /api/cv
 */
exports.createCv = async (req, res) => {
  try {
    const {
      userId,
      title = "Curriculum Vitae",
      personalInfo = {},
      experiences = [],
      education = [],
      skills = [],
      projects = [],
      certifications = [],
      languages = [],
      customSections = [],
      theme = {},
      isPrimary = true,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID wajib disertakan untuk menyimpan CV.",
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

    // Bungkus semua data CV menjadi JSON string untuk fleksibilitas editor
    const fullResumePayload = JSON.stringify({
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      certifications,
      languages,
      customSections,
      theme,
    });

    const [result] = await pool.query(
      `INSERT INTO cv_profiles (
        user_id, title, full_name, job_title, email, phone,
        location, website, linkedin, github, bio,
        avatar_url, avatar_shape, resume_data, is_primary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title,
        personalInfo.fullName || null,
        personalInfo.jobTitle || null,
        personalInfo.email || null,
        personalInfo.phone || null,
        personalInfo.location || null,
        personalInfo.website || null,
        personalInfo.linkedin || null,
        personalInfo.github || null,
        personalInfo.bio || null,
        personalInfo.avatarUrl || null,
        personalInfo.avatarShape || "circle",
        fullResumePayload,
        isPrimary ? 1 : 0,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Data CV berhasil disimpan ke database.",
      data: {
        id: result.insertId,
        userId,
        title,
      },
    });
  } catch (error) {
    console.error("Create CV Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan data CV ke database.",
      error: error.message,
    });
  }
};

/**
 * Update CV yang sudah ada
 * PUT /api/cv/:id
 */
exports.updateCv = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      personalInfo = {},
      experiences = [],
      education = [],
      skills = [],
      projects = [],
      certifications = [],
      languages = [],
      customSections = [],
      theme = {},
      isPrimary,
    } = req.body;

    const [existing] = await pool.query("SELECT id FROM cv_profiles WHERE id = ? LIMIT 1", [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "CV tidak ditemukan.",
      });
    }

    const fullResumePayload = JSON.stringify({
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      certifications,
      languages,
      customSections,
      theme,
    });

    await pool.query(
      `UPDATE cv_profiles SET
        title = COALESCE(?, title),
        full_name = ?,
        job_title = ?,
        email = ?,
        phone = ?,
        location = ?,
        website = ?,
        linkedin = ?,
        github = ?,
        bio = ?,
        avatar_url = ?,
        avatar_shape = ?,
        resume_data = ?,
        is_primary = COALESCE(?, is_primary),
        updated_at = NOW()
      WHERE id = ?`,
      [
        title,
        personalInfo.fullName || null,
        personalInfo.jobTitle || null,
        personalInfo.email || null,
        personalInfo.phone || null,
        personalInfo.location || null,
        personalInfo.website || null,
        personalInfo.linkedin || null,
        personalInfo.github || null,
        personalInfo.bio || null,
        personalInfo.avatarUrl || null,
        personalInfo.avatarShape || "circle",
        fullResumePayload,
        isPrimary !== undefined ? (isPrimary ? 1 : 0) : null,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Data CV berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Update CV Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui data CV.",
      error: error.message,
    });
  }
};

/**
 * Ambil semua CV milik user tertentu
 * GET /api/cv/user/:userId
 */
exports.getCvsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT id, user_id, title, full_name, job_title, email, phone, location,
              website, linkedin, github, avatar_url, avatar_shape,
              resume_data, is_primary, created_at, updated_at
       FROM cv_profiles
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [userId]
    );

    // Parse JSON resume_data jika ada
    const formatted = rows.map((row) => {
      let parsed = null;
      try {
        parsed = row.resume_data ? JSON.parse(row.resume_data) : null;
      } catch (e) {
        parsed = null;
      }
      return {
        ...row,
        resumeData: parsed,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("Get User CVs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data CV user.",
      error: error.message,
    });
  }
};

/**
 * Ambil satu CV berdasarkan ID
 * GET /api/cv/:id
 */
exports.getCvById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM cv_profiles WHERE id = ? LIMIT 1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "CV tidak ditemukan.",
      });
    }

    const row = rows[0];
    let parsed = null;
    try {
      parsed = row.resume_data ? JSON.parse(row.resume_data) : null;
    } catch (e) {
      parsed = null;
    }

    return res.status(200).json({
      success: true,
      data: {
        ...row,
        resumeData: parsed,
      },
    });
  } catch (error) {
    console.error("Get CV By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail CV.",
      error: error.message,
    });
  }
};

/**
 * Hapus CV berdasarkan ID
 * DELETE /api/cv/:id
 */
exports.deleteCv = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM cv_profiles WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "CV tidak ditemukan atau sudah dihapus.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "CV berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete CV Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus CV.",
      error: error.message,
    });
  }
};
