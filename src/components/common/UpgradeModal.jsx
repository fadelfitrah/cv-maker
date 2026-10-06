import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Crown, CheckCircle2, ShieldCheck, Download, Sparkles, Zap, Lock } from 'lucide-react';

export function UpgradeModal() {
  const { isUpgradeModalOpen, closeUpgradeModal, upgradeToPro, loading, user, isLoggedIn, openAuthModal } = useAuth();
  const { showToast } = useResume();
  const [selectedMethod, setSelectedMethod] = useState('qris');
  const [successMsg, setSuccessMsg] = useState('');

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      closeUpgradeModal();
      openAuthModal('login');
      return;
    }

    const res = await upgradeToPro('Pro Plan Lifetime', 49000, selectedMethod);
    if (res.success) {
      setSuccessMsg(res.message);
      showToast('Status akun Anda kini BERBAYAR (Pro)! Anda sekarang bebas mendownload CV.', 'success');
      setTimeout(() => {
        setSuccessMsg('');
        closeUpgradeModal();
      }, 1500);
    } else {
      showToast(res.message || 'Gagal memproses transaksi upgrade.', 'error');
    }
  };

  const proFeatures = [
    'Akses download file PDF CV berkualitas cetak (High Definition A4)',
    'Desain terstandarisasi lolos seleksi ATS Recruiter',
    'Bebas download tanpa watermark & tanpa batas revisi',
    'Penyimpanan profil pribadi di database MySQL secara aman',
    'Akses seluruh tema dan palet warna premium',
  ];

  return (
    <Modal
      isOpen={isUpgradeModalOpen}
      onClose={() => {
        setSuccessMsg('');
        closeUpgradeModal();
      }}
      title=""
      size="md"
    >
      <div className="-mt-3">
        {/* Banner Upgrade Header Modern Biru */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white text-center shadow-lg">
          <div className="absolute top-2 right-2 opacity-15">
            <Crown className="w-24 h-24" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase text-blue-100 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Fitur Khusus Berbayar
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">
            Tingkatkan ke Akun Pro
          </h3>
          <p className="text-xs text-blue-100/90 mt-1 max-w-sm mx-auto">
            Mode Free mengizinkan Anda mendesain dan mengedit CV. Upgrade ke mode Pro untuk membuka fitur <strong>Unduh PDF</strong>.
          </p>

          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="text-xs text-blue-200">Hanya</span>
            <span className="text-3xl font-extrabold tracking-tight">Rp 49.000</span>
            <span className="text-xs text-blue-200">/ Akses Selamanya</span>
          </div>
        </div>

        {/* Status Pengguna Saat Ini */}
        <div className="mt-4 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Status Akun Anda Saat Ini:</span>
          <span className={`font-bold px-2.5 py-0.5 rounded-full ${user?.plan_status === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
            {user?.plan_status === 'pro' ? 'Pro (Berbayar)' : 'Free (Belum Berbayar)'}
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="mt-4 space-y-2.5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Keuntungan Mode Berbayar:
          </p>
          <ul className="space-y-2">
            {proFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pilihan Metode Pembayaran Simulasi */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-[11px] font-bold text-slate-700 mb-2">
            Metode Pembayaran (Tersimpan ke Database):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'qris', label: 'QRIS Instan' },
              { id: 'bca_va', label: 'BCA / Mandiri' },
              { id: 'gopay', label: 'GoPay / OVO' },
            ].map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  selectedMethod === method.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Button
            variant="outline"
            onClick={closeUpgradeModal}
            className="flex-1 py-2.5 text-xs"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleUpgrade}
            loading={loading}
            icon={Zap}
            className="flex-1 py-2.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
          >
            {isLoggedIn ? 'Aktifkan Mode Pro Sekarang' : 'Login untuk Upgrade'}
          </Button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          Transaksi tercatat otomatis di database MySQL XAMPP
        </p>
      </div>
    </Modal>
  );
}
