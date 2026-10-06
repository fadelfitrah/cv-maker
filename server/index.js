const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Muat environment variables
dotenv.config();

const { initDatabase, testConnection } = require("./config/db");
const uploadProfileImage = require("./services/uploadService");

// Routes
const authRoutes = require("./routes/authRoutes");
const cvRoutes = require("./routes/cvRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// Menjadikan folder uploads dapat diakses oleh browser.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CV Maker API is running",
    timestamp: new Date().toISOString(),
  });
});

// Endpoint Upload Foto Profil
app.post(
  "/api/upload/profile",
  uploadProfileImage.single("profileImage"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Gambar belum dipilih.",
      });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/profile/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Foto profil berhasil diupload.",
      data: {
        filename: req.file.filename,
        url: imageUrl,
      },
    });
  }
);

// Daftarkan Routes Database
app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/transactions", transactionRoutes);

// Error handler untuk Multer dan error server lainnya
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  return res.status(400).json({
    success: false,
    message: err.message || "Gagal memproses permintaan.",
  });
});

// Jalankan Server & periksa database
app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`CV Maker API berjalan di http://localhost:${PORT}`);
  console.log(`=========================================`);

  // Inisialisasi dan tes koneksi MySQL XAMPP
  try {
    const isReady = await initDatabase();
    if (isReady) {
      await testConnection();
    }
  } catch (err) {
    console.error("Gagal menginisialisasi database saat startup:", err.message);
  }
});
