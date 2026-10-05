import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Input, Textarea } from "../common/Input";
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
} from "lucide-react";

export function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const info = resumeData.personalInfo;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Informasi Pribadi</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Data kontak utama dan ringkasan profil profesional Anda.
        </p>
      </div>

      {/* Avatar & Photo URL */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-xs shrink-0 flex items-center justify-center">
          {info.avatarUrl ? (
            <img
              src={info.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-slate-400" />
          )}
        </div>
        <div className="flex-1">
          <Input
            label="URL Foto Profil / Avatar"
            placeholder="https://images.unsplash.com/..."
            value={info.avatarUrl}
            onChange={(e) => updatePersonalInfo("avatarUrl", e.target.value)}
            icon={Image}
            helperText="Masukkan link URL gambar persegi (opsional)"
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
