const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Service API untuk Autentikasi User (MySQL)
 */
export const authApi = {
  /**
   * Pendaftaran User Baru
   */
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal melakukan registrasi.");
    }
    return result;
  },

  /**
   * Login User
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal melakukan login.");
    }
    return result;
  },

  /**
   * Ambil data detail user berdasarkan ID (termasuk plan_status terkini dari database)
   */
  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/${userId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil data pengguna.");
    }
    return result.data;
  },

  /**
   * Pengajuan Upgrade Plan user dari Free ke Pro (Menunggu ACC Admin)
   */
  upgradePlan: async (
    userId,
    planName = "Pro Membership Lifetime",
    amount = 49000,
    paymentMethod = "qris",
    paymentDetails = null,
    paymentProof = null
  ) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/upgrade-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        planName,
        amount,
        paymentMethod,
        paymentDetails,
        paymentProof,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengajukan upgrade plan.");
    }
    return result;
  },

  /**
   * Ambil daftar user
   */
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/users`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil daftar user.");
    }
    return result.data;
  },
};

/**
 * Service API untuk CV dan Data Pribadi (MySQL)
 */
export const cvApi = {
  /**
   * Mengambil CV aktif milik user dari database MySQL
   */
  getUserActiveCv: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/cv/user-active/${userId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memuat CV pengguna dari database.");
    }
    return result;
  },

  /**
   * Menyimpan / Auto-save CV aktif milik user langsung ke database MySQL
   */
  saveUserActiveCv: async (userId, resumeData, title = "Curriculum Vitae") => {
    const response = await fetch(`${API_BASE_URL}/api/cv/user-active/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeData, title }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menyimpan CV ke database.");
    }
    return result;
  },

  /**
   * Simpan dokumen CV baru ke database MySQL
   */
  createCv: async (userId, resumeData, title = "Curriculum Vitae") => {
    const payload = {
      userId,
      title,
      personalInfo: resumeData.personalInfo || {},
      experiences: resumeData.experiences || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      certifications: resumeData.certifications || [],
      languages: resumeData.languages || [],
      customSections: resumeData.customSections || [],
      theme: resumeData.theme || {},
    };

    const response = await fetch(`${API_BASE_URL}/api/cv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menyimpan data CV ke database.");
    }
    return result;
  },

  /**
   * Update CV yang sudah ada di database MySQL
   */
  updateCv: async (cvId, resumeData, title) => {
    const payload = {
      title,
      personalInfo: resumeData.personalInfo || {},
      experiences: resumeData.experiences || [],
      education: resumeData.education || [],
      skills: resumeData.skills || [],
      projects: resumeData.projects || [],
      certifications: resumeData.certifications || [],
      languages: resumeData.languages || [],
      customSections: resumeData.customSections || [],
      theme: resumeData.theme || {},
    };

    const response = await fetch(`${API_BASE_URL}/api/cv/${cvId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memperbarui data CV.");
    }
    return result;
  },

  /**
   * Ambil semua CV milik user
   */
  getCvsByUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/cv/user/${userId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil data CV.");
    }
    return result.data;
  },

  /**
   * Ambil satu CV detail berdasarkan ID
   */
  getCvById: async (cvId) => {
    const response = await fetch(`${API_BASE_URL}/api/cv/${cvId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil data CV.");
    }
    return result.data;
  },

  /**
   * Hapus CV
   */
  deleteCv: async (cvId) => {
    const response = await fetch(`${API_BASE_URL}/api/cv/${cvId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menghapus CV.");
    }
    return result;
  },
};

/**
 * Service API untuk Transaksi User (MySQL)
 */
export const transactionApi = {
  /**
   * Buat transaksi baru
   */
  createTransaction: async ({
    userId,
    planName,
    amount,
    currency = "IDR",
    paymentMethod = "manual_transfer",
    paymentDetails = null,
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        planName,
        amount,
        currency,
        paymentMethod,
        paymentDetails,
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mencatat transaksi.");
    }
    return result;
  },

  /**
   * Ambil riwayat transaksi milik user
   */
  getUserTransactions: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/transactions/user/${userId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil riwayat transaksi.");
    }
    return result.data;
  },

  /**
   * Update status transaksi (pending, paid, failed, cancelled)
   */
  updateStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengupdate status transaksi.");
    }
    return result;
  },

  /**
   * Upload bukti transfer pembayaran
   */
  uploadProof: async (file) => {
    const formData = new FormData();
    formData.append("proofImage", file);

    const response = await fetch(`${API_BASE_URL}/api/upload/payment-proof`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengupload bukti pembayaran.");
    }
    return result.data;
  },
};

/**
 * Service API Khusus Admin Dashboard (MySQL)
 */
export const adminApi = {
  /**
   * Mengambil statistik ringkasan dashboard admin
   */
  getOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/overview`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memuat ringkasan admin.");
    }
    return result.data;
  },

  /**
   * Mengambil semua daftar transaksi dengan filter status & pencarian
   */
  getTransactions: async ({ status = "all", search = "" } = {}) => {
    const query = new URLSearchParams();
    if (status && status !== "all") query.append("status", status);
    if (search) query.append("search", search);

    const response = await fetch(`${API_BASE_URL}/api/admin/transactions?${query.toString()}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memuat transaksi.");
    }
    return result.data;
  },

  /**
   * Mengambil transaksi yang berstatus pending (menunggu ACC)
   */
  getPendingTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/transactions/pending`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memuat transaksi pending.");
    }
    return result.data;
  },

  /**
   * ACC Transaksi & Ubah status user menjadi Pro
   */
  approveTransaction: async (orderId, adminNotes = "") => {
    const response = await fetch(`${API_BASE_URL}/api/admin/transactions/${orderId}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menyetujui transaksi.");
    }
    return result;
  },

  /**
   * Tolak Transaksi Pembayaran
   */
  rejectTransaction: async (orderId, reason = "") => {
    const response = await fetch(`${API_BASE_URL}/api/admin/transactions/${orderId}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal menolak transaksi.");
    }
    return result;
  },

  /**
   * Mengambil semua data pengguna beserta metrik CV & transaksinya
   */
  getUsers: async ({ search = "", plan = "all" } = {}) => {
    const query = new URLSearchParams();
    if (plan && plan !== "all") query.append("plan", plan);
    if (search) query.append("search", search);

    const response = await fetch(`${API_BASE_URL}/api/admin/users?${query.toString()}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal memuat pengguna.");
    }
    return result.data;
  },

  /**
   * Mengubah status Plan user secara langsung (Free <-> Pro Checklist)
   */
  updateUserPlan: async (userId, planStatus) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planStatus }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengubah status plan user.");
    }
    return result;
  },

  /**
   * Mengubah role user (user <-> admin)
   */
  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengubah role user.");
    }
    return result;
  },
};

