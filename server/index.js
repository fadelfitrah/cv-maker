const express = require("express");
const cors = require("cors");
const path = require("path");

const uploadProfileImage = require("./services/uploadService");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Menjadikan folder uploads dapat diakses oleh browser.
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CV Maker API is running",
  });
});

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

// Error handler untuk Multer dan error upload lainnya.
app.use((err, req, res, next) => {
  console.error("Upload error:", err);

  return res.status(400).json({
    success: false,
    message: err.message || "Gagal memproses upload.",
  });
});

app.listen(PORT, () => {
  console.log(`CV Maker API berjalan di http://localhost:${PORT}`);
});
