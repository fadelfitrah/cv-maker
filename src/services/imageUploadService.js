const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const imageUploadService = {
  /**
   * Upload foto profil ke backend.
   * @param {File} file
   * @returns {Promise<{filename: string, url: string}>}
   */
  uploadProfileImage: async (file) => {
    if (!file) {
      throw new Error("File gambar belum dipilih.");
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(`${API_BASE_URL}/api/upload/profile`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengupload gambar.");
    }

    return result.data;
  },
};
