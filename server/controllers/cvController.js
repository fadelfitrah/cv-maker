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

/**
 * Mengambil CV aktif/utama milik user dari database MySQL
 * Jika user baru login dan belum memiliki data di database,
 * sistem akan membuatkan template awal berisi nama & email user tersebut.
 * GET /api/cv/user-active/:userId
 */
exports.getUserActiveCv = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID diperlukan.",
      });
    }

    // Pastikan user terdaftar
    const [userRows] = await pool.query("SELECT id, name, email FROM users WHERE id = ? LIMIT 1", [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan di database.",
      });
    }
    const currentUser = userRows[0];

    // Ambil CV utama / terupdate milik user
    const [cvRows] = await pool.query(
      `SELECT * FROM cv_profiles 
       WHERE user_id = ? 
       ORDER BY is_primary DESC, updated_at DESC 
       LIMIT 1`,
      [userId]
    );

    if (cvRows.length > 0) {
      const row = cvRows[0];
      let resumeData = null;

      try {
        resumeData = row.resume_data ? JSON.parse(row.resume_data) : null;
      } catch (err) {
        resumeData = null;
      }

      // Pastikan fallback objek lengkap
      if (!resumeData || typeof resumeData !== "object") {
        resumeData = {
          personalInfo: {
            fullName: row.full_name || currentUser.name || "",
            jobTitle: row.job_title || "",
            email: row.email || currentUser.email || "",
            phone: row.phone || "",
            location: row.location || "",
            website: row.website || "",
            linkedin: row.linkedin || "",
            github: row.github || "",
            bio: row.bio || "",
            avatarUrl: row.avatar_url || "",
            avatarShape: row.avatar_shape || "circle",
          },
          experiences: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          languages: [],
          customSections: [],
          theme: {
            primaryColor: "#2563eb",
            fontFamily: "Inter",
            fontSize: "medium",
            template: "modern",
          },
        };
      } else {
        // Sinkronkan data kolom spesifik jika ada
        resumeData.personalInfo = {
          ...(resumeData.personalInfo || {}),
          avatarUrl: row.avatar_url || resumeData.personalInfo?.avatarUrl || "",
          avatarShape: row.avatar_shape || resumeData.personalInfo?.avatarShape || "circle",
          fullName: row.full_name || resumeData.personalInfo?.fullName || currentUser.name || "",
          jobTitle: row.job_title || resumeData.personalInfo?.jobTitle || "",
          email: row.email || resumeData.personalInfo?.email || currentUser.email || "",
          phone: row.phone || resumeData.personalInfo?.phone || "",
          location: row.location || resumeData.personalInfo?.location || "",
          website: row.website || resumeData.personalInfo?.website || "",
          linkedin: row.linkedin || resumeData.personalInfo?.linkedin || "",
          github: row.github || resumeData.personalInfo?.github || "",
          bio: row.bio || resumeData.personalInfo?.bio || "",
        };
      }

      return res.status(200).json({
        success: true,
        isNew: false,
        cvId: row.id,
        title: row.title,
        data: resumeData,
      });
    }

    // Jika user BELUM memiliki CV di database, inisialisasi data baru di database
    const initialResumeData = {
      personalInfo: {
        fullName: currentUser.name || "",
        jobTitle: "",
        email: currentUser.email || "",
        phone: "",
        location: "",
        website: "",
        linkedin: "",
        github: "",
        bio: "",
        avatarUrl: "",
        avatarShape: "circle",
      },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
      theme: {
        primaryColor: "#2563eb",
        fontFamily: "Inter",
        fontSize: "medium",
        template: "modern",
      },
    };

    const [insertResult] = await pool.query(
      `INSERT INTO cv_profiles (
        user_id, title, full_name, email, avatar_shape,
        resume_data, is_primary
      ) VALUES (?, 'Curriculum Vitae', ?, ?, 'circle', ?, 1)`,
      [
        userId,
        currentUser.name || "",
        currentUser.email || "",
        JSON.stringify(initialResumeData),
      ]
    );

    return res.status(200).json({
      success: true,
      isNew: true,
      cvId: insertResult.insertId,
      title: "Curriculum Vitae",
      data: initialResumeData,
    });
  } catch (error) {
    console.error("Get User Active CV Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memuat data CV dari database MySQL.",
      error: error.message,
    });
  }
};

/**
 * Menyimpan data perubahan CV aktif milik user ke database MySQL (Auto-Save Target)
 * PUT /api/cv/user-active/:userId
 */
exports.saveUserActiveCv = async (req, res) => {
  try {
    const { userId } = req.params;
    const { resumeData, title = "Curriculum Vitae" } = req.body;

    if (!userId || !resumeData) {
      return res.status(400).json({
        success: false,
        message: "User ID dan data CV diperlukan untuk menyimpan ke database.",
      });
    }

    // Pastikan user ada
    const [userRows] = await pool.query("SELECT id FROM users WHERE id = ? LIMIT 1", [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan di database.",
      });
    }

    const personal = resumeData.personalInfo || {};
    const fullPayloadStr = JSON.stringify(resumeData);

    // Cek apakah user sudah punya CV di database
    const [existing] = await pool.query(
      "SELECT id FROM cv_profiles WHERE user_id = ? ORDER BY is_primary DESC, updated_at DESC LIMIT 1",
      [userId]
    );

    let cvId;
    if (existing.length > 0) {
      cvId = existing[0].id;
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
          updated_at = NOW()
        WHERE id = ?`,
        [
          title,
          personal.fullName || null,
          personal.jobTitle || null,
          personal.email || null,
          personal.phone || null,
          personal.location || null,
          personal.website || null,
          personal.linkedin || null,
          personal.github || null,
          personal.bio || null,
          personal.avatarUrl || null,
          personal.avatarShape || "circle",
          fullPayloadStr,
          cvId,
        ]
      );
    } else {
      const [insertResult] = await pool.query(
        `INSERT INTO cv_profiles (
          user_id, title, full_name, job_title, email, phone,
          location, website, linkedin, github, bio,
          avatar_url, avatar_shape, resume_data, is_primary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          userId,
          title,
          personal.fullName || null,
          personal.jobTitle || null,
          personal.email || null,
          personal.phone || null,
          personal.location || null,
          personal.website || null,
          personal.linkedin || null,
          personal.github || null,
          personal.bio || null,
          personal.avatarUrl || null,
          personal.avatarShape || "circle",
          fullPayloadStr,
        ]
      );
      cvId = insertResult.insertId;
    }

    return res.status(200).json({
      success: true,
      message: "Data CV berhasil disimpan ke database MySQL.",
      data: {
        cvId,
        userId: Number(userId),
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Save User Active CV Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan data CV ke database MySQL.",
      error: error.message,
    });
  }
};

