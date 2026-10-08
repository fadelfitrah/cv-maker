import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useResume } from "../../context/ResumeContext";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { transactionApi } from "../../services/apiService";
import {
  Crown,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  Upload,
  AlertCircle,
  FileCheck,
  CreditCard,
  QrCode,
  Building,
} from "lucide-react";

export function UpgradeModal() {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    upgradeToPro,
    loading,
    user,
    isLoggedIn,
    openAuthModal,
    pendingOrder,
  } = useAuth();
  const { showToast } = useResume();

  const [selectedMethod, setSelectedMethod] = useState("bca");
  const [senderName, setSenderName] = useState("");
  const [senderNote, setSenderNote] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState("");

  const paymentChannels = [
    {
      id: "bca",
      label: "BCA Transfer",
      icon: Building,
      accountNo: "1711-576-725",
      accountName: "TITIK RAHMAWATI",
    },
    {
      id: "seabank",
      label: "Seabank Transfer",
      icon: CreditCard,
      accountNo: "901762885268",
      accountName: "NEPAN",
    },
    {
      id: "qris",
      label: "QRIS Semua E-Wallet",
      icon: QrCode,
      qrimage: "../../../public/images/qrimage.jpeg",
      accountName: "Cantika",
    },
  ];

  const currentChannel =
    paymentChannels.find((p) => p.id === selectedMethod) || paymentChannels[0];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Ukuran file maksimal 5MB.", "error");
        return;
      }
      setProofFile(file);
    }
  };

  const handleRequestUpgrade = async () => {
    if (!isLoggedIn) {
      closeUpgradeModal();
      openAuthModal("login");
      return;
    }

    if (!senderName.trim()) {
      showToast(
        "Mohon masukkan nama pengirim atau pemilik rekening transfer.",
        "error",
      );
      return;
    }

    setUploadingProof(true);
    let proofUrl = null;

    try {
      if (proofFile) {
        const uploadRes = await transactionApi.uploadProof(proofFile);
        if (uploadRes?.url) {
          proofUrl = uploadRes.url;
        }
      }

      const paymentDetails = {
        senderName: senderName.trim(),
        paymentMethodName: currentChannel.label,
        accountTarget: `${currentChannel.accountNo} (${currentChannel.accountName})`,
        senderNote: senderNote.trim() || "Pembayaran upgrade plan Pro",
        submittedAt: new Date().toISOString(),
      };

      const res = await upgradeToPro(
        "Pro Plan Lifetime",
        49000,
        selectedMethod,
        paymentDetails,
        proofUrl,
      );

      if (res.success) {
        setSubmittedOrderId(res.data?.orderId || "CVM-TRX");
        setRequestSubmitted(true);
        showToast(
          "Permintaan upgrade berhasil dikirim! Mohon tunggu konfirmasi dan verifikasi (ACC) dari Admin.",
          "success",
        );
      } else {
        showToast(res.message || "Gagal mengajukan upgrade.", "error");
      }
    } catch (err) {
      showToast(
        err.message || "Terjadi kesalahan saat memproses transaksi.",
        "error",
      );
    } finally {
      setUploadingProof(false);
    }
  };

  const resetForm = () => {
    setRequestSubmitted(false);
    setSenderName("");
    setSenderNote("");
    setProofFile(null);
    closeUpgradeModal();
  };

  return (
    <Modal isOpen={isUpgradeModalOpen} onClose={resetForm} title="" size="lg">
      <div className="-mt-3">
        {/* Banner Upgrade Header Modern */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 text-white text-center shadow-lg">
          <div className="absolute top-2 right-2 opacity-15 pointer-events-none">
            <Crown className="w-24 h-24" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-blue-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Fitur Akses Penuh & Unduh PDF
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">
            Tingkatkan ke Akun Pro
          </h3>
          <p className="text-xs text-blue-100/90 mt-1 max-w-md mx-auto">
            Mode Free untuk mendesain dan mengedit CV. Buka status{" "}
            <strong>Pro</strong> untuk membuka unduhan PDF ATS tanpa watermark &
            akses tema premium.
          </p>

          <div className="mt-4 flex items-baseline justify-center gap-1.5">
            <span className="text-xs text-blue-200">Biaya Investasi:</span>
            <span className="text-3xl font-extrabold tracking-tight">
              Rp 20.000
            </span>
            <span className="text-xs text-blue-200">
              / Sekali Bayar Selamanya
            </span>
          </div>
        </div>

        {/* Jika Permintaan Baru Saja Terkirim atau Sudah Ada Pending Order */}
        {(requestSubmitted || pendingOrder) && (
          <div className="mt-5 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-950">
                  Permintaan Sedang Menunggu Persetujuan (ACC) Admin
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Data pembayaran Anda telah masuk ke sistem. Sistem kami{" "}
                  <strong>tidak mengubah status Anda secara otomatis</strong>{" "}
                  demi keamanan verifikasi keuangan. Administrator akan mengecek
                  mutasi transfer dan melakukan checklist ACC di Dashboard
                  Admin.
                </p>
                <div className="pt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-amber-900 font-mono">
                  <span className="bg-amber-200/80 px-2 py-0.5 rounded font-semibold">
                    Order ID:{" "}
                    {submittedOrderId || pendingOrder?.orderId || "CVM-PENDING"}
                  </span>
                  <span className="bg-amber-100 px-2 py-0.5 rounded font-semibold text-amber-700">
                    Status: Pending (Menunggu Verifikasi)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-amber-700">
                Pemberitahuan: Harap tunggu beberapa saat. Anda dapat menutup
                jendela ini.
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={resetForm}
                className="border-amber-300"
              >
                Tutup Jendela
              </Button>
            </div>
          </div>
        )}

        {/* Form Pengajuan Upgrade jika Belum Submit */}
        {!requestSubmitted && !pendingOrder && (
          <div className="mt-5 space-y-4">
            {/* Kebijakan Sistem: Verifikasi Manual Admin */}
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-900">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Proses Verifikasi Pembayaran:</span>{" "}
                Sistem tidak mengubah status akun Anda secara otomatis. Setelah
                mengirim formulir ini, informasi transaksi dikirimkan ke{" "}
                <strong>Dashboard Admin</strong> untuk dicek pembayarannya dan
                di-ACC secara manual.
              </div>
            </div>

            {/* Pilihan Rekening Pembayaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. Pilih Metode / Rekening Tujuan Transfer:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {paymentChannels.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = selectedMethod === channel.id;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => setSelectedMethod(channel.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20"
                          : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon
                          className={`w-3.5 h-3.5 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                        />
                        <span className="text-[11px] font-bold truncate">
                          {channel.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Rincian Rekening Terpilih */}
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                {currentChannel.id === "qris" ? (
                  // Tampilan khusus QRIS
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Scan QRIS untuk Pembayaran
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        a/n {currentChannel.accountName}
                      </span>
                    </div>

                    {currentChannel.qrimage && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                        <img
                          src={currentChannel.qrimage}
                          alt="QRIS Pembayaran"
                          className="w-70 h-70 object-contain"
                        />
                      </div>
                    )}

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">
                        Total Pembayaran:
                      </span>

                      <span className="text-sm font-extrabold text-blue-600">
                        Rp 20.000
                      </span>
                    </div>
                  </div>
                ) : (
                  // Tampilan untuk transfer bank / metode pembayaran lainnya
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Nomor Rekening / Pembayaran:
                      </span>

                      <span className="text-sm font-bold font-mono text-slate-900">
                        {currentChannel.accountNo}
                      </span>

                      <span className="text-[11px] text-slate-500 block">
                        a/n {currentChannel.accountName}
                      </span>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[10px] text-slate-400 block">
                        Total Transfer:
                      </span>

                      <span className="text-sm font-extrabold text-blue-600">
                        Rp 20.000
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Formulir Konfirmasi Transfer */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                2. Data Konfirmasi Pengirim (Untuk Pengecekan Admin):
              </label>

              <div>
                <input
                  type="text"
                  placeholder="Nama Pengirim / Pemilik Rekening Transfer *"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Catatan tambahan (misal: Transfer via m-BCA jam 14:30) (Opsional)"
                  value={senderNote}
                  onChange={(e) => setSenderNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Upload Bukti Transfer */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Upload Bukti Transfer / Screenshot (Opsional tapi mempercepat
                  ACC):
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 cursor-pointer text-xs text-slate-600 transition-colors">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="truncate">
                      {proofFile
                        ? proofFile.name
                        : "Pilih file struk transfer (JPG, PNG, PDF)"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {proofFile && (
                    <button
                      type="button"
                      onClick={() => setProofFile(null)}
                      className="text-xs text-rose-500 hover:underline px-2 py-1"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1 py-2.5 text-xs"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={handleRequestUpgrade}
                loading={loading || uploadingProof}
                icon={Zap}
                className="flex-1 py-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
              >
                {isLoggedIn
                  ? "Kirim Konfirmasi ke Admin"
                  : "Login untuk Upgrade"}
              </Button>
            </div>

            <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Transaksi akan diteruskan ke Dashboard Admin untuk diverifikasi &
              di-ACC manual.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
