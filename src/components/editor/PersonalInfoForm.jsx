import React, { useEffect, useRef, useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { Input, Textarea } from "../common/Input";
import { imageUploadService } from "../../services/imageUploadService";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  FolderKanban,
  FolderGit2,
  Image,
  Upload,
  Trash2,
  LoaderCircle,
  Circle,
  Square,
} from "lucide-react";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const info = resumeData.personalInfo;
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(info.avatarUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const avatarShape = info.avatarShape || "circle";

  const handleAvatarShapeChange = (shape) => {
    updatePersonalInfo("avatarShape", shape);
  };

  useEffect(() => {
    setPreviewUrl(info.avatarUrl || "");
  }, [info.avatarUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    // Reset input agar file yang sama dapat dipilih lagi
    event.target.value = "";

    if (!file) return;

    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("File harus berupa gambar.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Ukuran gambar maksimal 2 MB.");
      return;
    }

    // Tampilkan preview lokal terlebih dahulu
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      setIsUploading(true);

      const uploaded = await imageUploadService.uploadProfileImage(file);

      // Simpan URL hasil upload ke state CV.
      updatePersonalInfo("avatarUrl", uploaded.url);

      // Ganti preview blob dengan URL dari server.
      setPreviewUrl(uploaded.url);
    } catch (error) {
      console.error("Upload profile image error:", error);
      setUploadError(error.message || "Gagal mengupload gambar.");
    } finally {
      setIsUploading(false);

      URL.revokeObjectURL(localPreview);
    }
  };

  const handleRemoveImage = () => {
    updatePersonalInfo("avatarUrl", "");
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Informasi Pribadi</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Data kontak utama dan ringkasan profil profesional Anda.
        </p>
      </div>

      {/* Avatar & Photo Upload */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <div
            className={`relative w-20 h-20 overflow-hidden bg-slate-200 border-2 border-white shadow-sm shrink-0 flex items-center justify-center ${
              avatarShape === "square" ? "rounded-lg" : "rounded-full"
            }`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={info.fullName || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-9 h-9 text-slate-400" />
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center">
                <LoaderCircle className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800">
              Foto Profil / Avatar
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Pilih foto dari komputer. Format JPG, PNG, atau WebP, maksimal 2 MB.
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                onClick={handleSelectImage}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isUploading ? (
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {isUploading ? "Mengupload..." : "Pilih Foto"}
              </button>

              {info.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-semibold hover:bg-slate-50 disabled:opacity-60 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Bentuk Foto di CV
              </p>

              <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleAvatarShapeChange("circle")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    avatarShape === "circle"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-pressed={avatarShape === "circle"}
                >
                  <Circle className="w-3.5 h-3.5" />
                  Bulat
                </button>

                <button
                  type="button"
                  onClick={() => handleAvatarShapeChange("square")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                    avatarShape === "square"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-pressed={avatarShape === "square"}
                >
                  <Square className="w-3.5 h-3.5" />
                  Kotak
                </button>
              </div>

              <p className="text-[11px] text-slate-500 mt-1.5">
                Pilihan ini juga diterapkan pada CV Preview dan hasil PDF.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {uploadError && (
              <p className="text-xs text-red-600 mt-2">
                {uploadError}
              </p>
            )}
          </div>
        </div>

        {/* Manual URL remains available as an alternative */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <Input
            label="Atau gunakan URL Foto Profil"
            placeholder="https://example.com/foto.jpg"
            value={info.avatarUrl}
            onChange={(e) => updatePersonalInfo("avatarUrl", e.target.value)}
            icon={Image}
            helperText="Opsional. URL ini akan digunakan sebagai sumber foto jika Anda tidak mengupload file."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap & Gelar"
          placeholder="e.g. Budi Pratama, S.Kom"
          value={info.fullName}
          onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
          icon={User}
          required
        />
        <Input
          label="Profesi / Jabatan Impian"
          placeholder="e.g. Senior Frontend Engineer"
          value={info.jobTitle}
          onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
          icon={Briefcase}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="e.g. budi.pratama@email.com"
          value={info.email}
          onChange={(e) => updatePersonalInfo("email", e.target.value)}
          icon={Mail}
          required
        />
        <Input
          label="Nomor Telepon / WhatsApp"
          placeholder="e.g. +62 812-3456-7890"
          value={info.phone}
          onChange={(e) => updatePersonalInfo("phone", e.target.value)}
          icon={Phone}
        />
      </div>

      <Input
        label="Domisili / Lokasi"
        placeholder="e.g. Jakarta Selatan, Indonesia (Bisa Remote)"
        value={info.location}
        onChange={(e) => updatePersonalInfo("location", e.target.value)}
        icon={MapPin}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Website Pribadi"
          placeholder="https://budipratama.dev"
          value={info.website}
          onChange={(e) => updatePersonalInfo("website", e.target.value)}
          icon={Globe}
        />
        <Input
          label="Profil LinkedIn"
          placeholder="https://linkedin.com/in/..."
          value={info.linkedin}
          onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
          icon={FolderKanban}
        />
        <Input
          label="GitHub / Dribbble / Portfolio"
          placeholder="https://github.com/..."
          value={info.github}
          onChange={(e) => updatePersonalInfo("github", e.target.value)}
          icon={FolderGit2}
        />
      </div>

      <Textarea
        label="Ringkasan Profesional (Bio / Summary)"
        rows={4}
        placeholder="Tuliskan 2-4 kalimat rangkuman pengalaman utama, keahlian kunci, dan pencapaian Anda..."
        value={info.bio}
        onChange={(e) => updatePersonalInfo("bio", e.target.value)}
        helperText="Tips: Sebutkan spesialisasi utama, tahun pengalaman, dan nilai tambah yang Anda bawa."
      />
    </div>
  );
}
