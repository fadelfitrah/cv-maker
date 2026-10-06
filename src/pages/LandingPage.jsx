import React from "react";
import { useAuth } from "../context/AuthContext";
import { useResume } from "../context/ResumeContext";
import { TEMPLATE_LIST } from "../types/resume";
import { Button } from "../components/common/Button";
import {
  FileText,
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Layout,
  Layers,
  Database,
  Lock,
  Star,
  Users,
  Award,
} from "lucide-react";

export function LandingPage() {
  const { isLoggedIn, isPro, user, openAuthModal, openUpgradeModal } =
    useAuth();
  const { setActivePage } = useResume();

  const handleStartEditing = () => {
    if (isLoggedIn) {
      setActivePage("editor");
    } else {
      openAuthModal("login", "editor");
    }
  };

  const handleSelectTemplate = (templateId) => {
    if (isLoggedIn) {
      setActivePage("editor");
    } else {
      openAuthModal("login", "editor");
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 overflow-hidden">
      {/* ========================================================
          1. HERO SECTION (Modern Elegan Biru & Putih)
      ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-blue-50/70 via-white to-white border-b border-blue-100/50">
        {/* Subtle geometric light shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute top-[-10%] right-[10%] w-[450px] h-[450px] rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide shadow-xs mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Platform CV Maker Profesional & Terintegrasi Database MySQL
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Bangun CV Profesional Impian Anda dengan{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent">
                Mudah, Cepat, & Elegan
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Rancang curriculum vitae yang siap lolos seleksi ATS recruiter.
              Gunakan mode gratis untuk bereksperimen mengedit, dan beralih ke
              mode berbayar untuk mengunduh hasil PDF kualitas tinggi kapan
              saja.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartEditing}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all text-sm cursor-pointer"
              >
                {isLoggedIn
                  ? "Buka Workspace Editor"
                  : "Mulai Buat CV Sekarang"}
              </Button>

              <a
                href="#templates"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs"
              >
                Lihat Contoh Template
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Format Standar ATS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Tersimpan di Database XAMPP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Aman & Fleksibel</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Mockup Box */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-blue-100 bg-white/80 p-3 sm:p-5 shadow-2xl shadow-blue-900/10 backdrop-blur-sm">
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-slate-50">
                {/* Browser top-bar */}
                <div className="h-10 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 bg-slate-100 px-4 py-1 rounded-md">
                    cv-maker-workspace.local
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">
                    Live Preview
                  </div>
                </div>

                {/* Hero Visual Banner Inside Mockup */}
                <div className="p-6 sm:p-10 bg-white grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-5 space-y-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] uppercase tracking-wider">
                      Alur Kerja Simpel
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Edit Langsung, Pratinjau Seketika
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lengkapi data pribadi, riwayat pendidikan, portofolio
                      proyek, dan kemampuan Anda. Editor kami menyusun semuanya
                      secara otomatis dengan rasio tipografi seimbang.
                    </p>
                    <div className="pt-2">
                      <Button
                        size="sm"
                        onClick={handleStartEditing}
                        className="bg-blue-600 text-white font-semibold hover:bg-blue-700"
                      >
                        Coba Editor Sekarang
                      </Button>
                    </div>
                  </div>

                  <div className="md:col-span-7 bg-slate-100/70 p-4 rounded-xl border border-slate-200/80 shadow-inner">
                    <div className="bg-white rounded-lg shadow-md p-5 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                          JD
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">
                            John Doe, S.Kom
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            Senior Software Engineer
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="h-2 bg-slate-100 rounded-sm w-3/4" />
                        <div className="h-2 bg-slate-100 rounded-sm w-full" />
                        <div className="h-2 bg-slate-100 rounded-sm w-5/6" />
                      </div>
                      <div className="flex gap-1.5 pt-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                          React.js
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                          Node.js
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                          MySQL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FITUR UTAMA SISTEM
      ======================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Keunggulan Sistem
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-slate-950 tracking-tight sm:text-4xl">
              Didesain untuk Memaksimalkan Peluang Karir Anda
            </p>
            <p className="mt-3 text-slate-600 text-sm">
              Sistem CV Maker kami memadukan kecepatan penulisan, fleksibilitas
              desain, dan keamanan penyimpanan data pribadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-blue-50/20 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Live Realtime Editor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tiap ketikan pada form data pribadi, pengalaman, dan keahlian
                langsung ditampilkan secara live pada preview tanpa perlu
                refresh halaman.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-blue-50/20 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Penyimpanan Terpusat MySQL
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data registrasi akun, profil CV, hingga riwayat transaksi
                tersimpan rapi dan aman di database MySQL XAMPP Anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/90 bg-blue-50/20 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Ekspor PDF Kualitas Cetak
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bagi anggota Pro, hasil CV dapat langsung diunduh dalam format
                PDF standar A4 resolusi tinggi, siap kirim ke portal lamaran
                kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SHOWCASE TEMPLATE CV
      ======================================================== */}
      <section
        id="templates"
        className="py-20 bg-slate-50 border-y border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Koleksi Template
              </span>
              <h2 className="mt-1 text-3xl font-extrabold text-slate-950 tracking-tight">
                Pilih Template Sesuai Profesi Anda
              </h2>
              <p className="mt-2 text-slate-600 text-sm max-w-xl">
                Setiap template dirancang khusus dengan memperhatikan hierarki
                visual dan keterbacaan recruiter.
              </p>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  if (isLoggedIn) {
                    setActivePage("templates");
                  } else {
                    openAuthModal("login", "templates");
                  }
                }}
                className="text-xs font-bold"
              >
                Lihat Semua Template
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_LIST.slice(0, 5).map((tpl) => (
              <div
                key={tpl.id}
                className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Mockup Representatif */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/70 p-3 mb-4 group-hover:scale-[1.01] transition-transform">
                    {/* Mini layout preview card */}
                    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200/70 p-3 flex flex-col justify-between">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                          CV
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="h-2 bg-slate-800 rounded-sm w-1/2" />
                          <div className="h-1.5 bg-blue-500 rounded-sm w-1/3" />
                        </div>
                      </div>
                      <div className="space-y-1.5 py-1">
                        <div className="h-1.5 bg-slate-200 rounded-sm w-full" />
                        <div className="h-1.5 bg-slate-200 rounded-sm w-4/5" />
                        <div className="h-1.5 bg-slate-200 rounded-sm w-3/4" />
                      </div>
                      <div className="flex gap-1">
                        <div className="h-2 w-8 bg-blue-100 rounded-sm" />
                        <div className="h-2 w-8 bg-blue-100 rounded-sm" />
                      </div>
                    </div>

                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-blue-700 shadow-xs border border-slate-200">
                      {tpl.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-600 uppercase">
                      {tpl.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className="w-full text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                  >
                    Gunakan Template Ini
                  </Button>
                </div>
              </div>
            ))}

            {/* Banner Custom Template Card */}
            <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-6 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Kustomisasi Penuh
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Ubah warna aksen, font, hingga struktur section sesuai kebutuhan
                Anda.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartEditing}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
              >
                Mulai Custom Sendiri
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. PRICING & PLAN COMPARISON (Free vs Berbayar)
      ======================================================== */}
      <section id="pricing" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Pilihan Paket
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950 tracking-tight sm:text-4xl">
              Harga Transparan, Pilih Paket Anda
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Mulai secara gratis untuk mengedit seluruh konten CV Anda. Upgrade
              ke mode Pro untuk membuka fitur unduh PDF tanpa batas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* PLAN 1: FREE MODE */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                    Mode Dasar
                  </span>
                  {user && user.plan_status === "free" && (
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Paket Aktif Anda
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Free Editor
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sangat cocok untuk merancang dan menyusun draft awal CV Anda.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    Rp 0
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    / Selamanya
                  </span>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Akses penuh Editor CV & Portofolio</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Pilihan seluruh template yang tersedia</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Live Preview seketika saat mengedit</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Penyimpanan data di LocalStorage browser</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-400">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="line-through">
                      Download hasil CV ke file PDF
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-400">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="line-through">
                      Penyimpanan cloud database MySQL permanen
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Button
                  variant="outline"
                  onClick={handleStartEditing}
                  className="w-full py-3 text-xs font-bold border-slate-300 hover:border-slate-400 text-slate-800"
                >
                  {isLoggedIn ? "Lanjutkan Edit (Free)" : "Coba Mode Free"}
                </Button>
              </div>
            </div>

            {/* PLAN 2: BERBAYAR (PRO MODE) */}
            <div className="relative rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-50/40 via-white to-white p-8 flex flex-col justify-between shadow-xl shadow-blue-600/10">
              {/* Highlight Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                Paling Direkomendasikan
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    Mode Berbayar
                  </span>
                  {user && user.plan_status === "pro" && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ Paket Aktif Anda
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                  Pro Membership
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Buka akses unduh PDF resolusi tinggi dan simpan profil di
                  database MySQL.
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-blue-600">
                    Rp 49.000
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / Sekali Bayar (Lifetime)
                  </span>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Semua fitur yang ada pada Mode Free</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-blue-700 font-bold bg-blue-50/70 p-2 rounded-xl">
                    <Download className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Download CV ke PDF Tanpa Batas (High-Res A4)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Bebas watermark & siap scan sistem ATS</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Tersimpan permanen di database MySQL XAMPP</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Riwayat transaksi terekam otomatis di sistem</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6">
                {isPro ? (
                  <Button
                    variant="primary"
                    onClick={handleStartEditing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    Akun Pro Aktif - Mulai Download CV
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (!isLoggedIn) {
                        openAuthModal("login");
                      } else {
                        openUpgradeModal();
                      }
                    }}
                    icon={Zap}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/20"
                  >
                    {isLoggedIn
                      ? "Upgrade ke Pro Sekarang"
                      : "Login untuk Ambil Paket Pro"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CTA FINAL SECTION
      ======================================================== */}
      <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Siap Menghasilkan CV Terbaik Anda Hari Ini?
          </h2>
          <p className="mt-3 text-sm text-blue-100/90 max-w-xl mx-auto">
            Bergabunglah dengan para profesional yang telah membuat curriculum
            vitae elegan dan efektif untuk meraih karir impian.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleStartEditing}
              className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-blue-700 text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg"
            >
              {isLoggedIn
                ? "Masuk ke Halaman Editor"
                : "Daftar & Mulai Sekarang (Gratis)"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
