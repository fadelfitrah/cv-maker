import React, { useState, useEffect, useCallback, useRef } from 'react';
import { adminApi } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  Crown,
  Bell,
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserX,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Check,
  X,
  ArrowUpDown,
  Lock,
} from 'lucide-react';

// Fungsi bantuan bunyi ping notifikasi saat transaksi baru masuk (Web Audio API aman)
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Abaikan jika browser memblokir audio autoplay sebelum interaksi
  }
}

export function AdminDashboard() {
  const { user, isAdmin, refreshUser } = useAuth();
  const { showToast, setActivePage } = useResume();

  // State overview & list
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter & Search
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'users'
  const [trxStatusFilter, setTrxStatusFilter] = useState('all'); // 'all' | 'pending' | 'paid' | 'failed'
  const [trxSearch, setTrxSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('all'); // 'all' | 'free' | 'pro'
  const [userSearch, setUserSearch] = useState('');

  // Modal Bukti Pembayaran
  const [previewProofUrl, setPreviewProofUrl] = useState(null);
  const [selectedProofTrx, setSelectedProofTrx] = useState(null);

  // Modal Tolak Transaksi
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [trxToReject, setTrxToReject] = useState(null);
  const [rejectReason, setRejectReason] = useState('Bukti pembayaran tidak sesuai atau dana belum masuk di mutasi rekening.');
  const [rejecting, setRejecting] = useState(false);

  // Action Loading State per Transaksi / User
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Tracking pending count sebelumnya untuk alert transaksi baru
  const previousPendingCountRef = useRef(null);

  // Muat data dari Backend MySQL
  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const [overviewData, trxData, usersData] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getTransactions({ status: trxStatusFilter, search: trxSearch }),
        adminApi.getUsers({ plan: userPlanFilter, search: userSearch }),
      ]);

      setOverview(overviewData);
      setTransactions(trxData);
      setUsersList(usersData);

      // Cek apakah ada transaksi pending baru yang masuk
      const pendingCount = overviewData?.transactions?.pending || 0;
      if (
        previousPendingCountRef.current !== null &&
        pendingCount > previousPendingCountRef.current
      ) {
        playNotificationSound();
        showToast(
          `🔔 Notifikasi: Ada ${pendingCount - previousPendingCountRef.current} transaksi pembayaran baru menunggu ACC Anda!`,
          'info'
        );
      }
      previousPendingCountRef.current = pendingCount;
    } catch (err) {
      console.error('Admin Load Error:', err);
      if (!isSilent) {
        showToast(err.message || 'Gagal memuat data admin dashboard.', 'error');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [trxStatusFilter, trxSearch, userPlanFilter, userSearch, showToast]);

  // Initial load & Polling otomatis setiap 8 detik untuk mendeteksi transaksi baru secara real-time
  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Handler ACC / Checklist Transaksi
  const handleApproveTransaction = async (orderId, customerName) => {
    setActionLoadingId(`approve-${orderId}`);
    try {
      const res = await adminApi.approveTransaction(
        orderId,
        'Pembayaran telah diverifikasi oleh Admin. Akun Pro diaktifkan.'
      );
      showToast(
        `Sukses! Transaksi #${orderId} telah di-ACC. Pengguna ${customerName} sekarang berstatus PRO!`,
        'success'
      );
      // Refresh data
      loadDashboardData(true);
      // Jika user yang login adalah user yang sama, refresh
      if (user?.id) refreshUser();
    } catch (err) {
      showToast(err.message || 'Gagal menyetujui transaksi.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Buka Modal Tolak Transaksi
  const openRejectModal = (trx) => {
    setTrxToReject(trx);
    setRejectReason('Bukti transfer tidak valid atau dana belum tertera pada mutasi bank.');
    setRejectModalOpen(true);
  };

  // Submit Penolakan Transaksi
  const handleConfirmReject = async () => {
    if (!trxToReject) return;
    setRejecting(true);
    try {
      await adminApi.rejectTransaction(trxToReject.order_id, rejectReason);
      showToast(`Transaksi #${trxToReject.order_id} telah ditolak. Status pengguna tetap Free.`, 'info');
      setRejectModalOpen(false);
      setTrxToReject(null);
      loadDashboardData(true);
    } catch (err) {
      showToast(err.message || 'Gagal menolak transaksi.', 'error');
    } finally {
      setRejecting(false);
    }
  };

  // Handler Checklist Manual Status Plan User (Free <-> Pro)
  const handleToggleUserPlan = async (userId, userName, currentPlan) => {
    const nextPlan = currentPlan === 'pro' ? 'free' : 'pro';
    setActionLoadingId(`plan-${userId}`);
    try {
      await adminApi.updateUserPlan(userId, nextPlan);
      showToast(
        `Status ${userName} berhasil diubah dari ${currentPlan.toUpperCase()} menjadi ${nextPlan.toUpperCase()}!`,
        'success'
      );
      loadDashboardData(true);
      if (user?.id === userId) refreshUser();
    } catch (err) {
      showToast(err.message || 'Gagal mengubah status plan user.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler Ganti Role User (Admin <-> User)
  const handleToggleUserRole = async (userId, userName, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    setActionLoadingId(`role-${userId}`);
    try {
      await adminApi.updateUserRole(userId, nextRole);
      showToast(`Role untuk ${userName} berhasil diubah menjadi ${nextRole.toUpperCase()}!`, 'success');
      loadDashboardData(true);
      if (user?.id === userId) refreshUser();
    } catch (err) {
      showToast(err.message || 'Gagal mengubah role user.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = overview?.transactions?.pending || 0;

  // Format Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Format Tanggal
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Admin */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Admin Dashboard & Verifikasi Transaksi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700">
                  Panel Pengelola
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pantau pendaftaran user, mutasi transaksi baru, serta checklist persetujuan pembayaran (ACC).
              </p>
            </div>
          </div>

          {/* Real-time Indicator & Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Lonceng & Badge Notifikasi Pending */}
            <div
              onClick={() => {
                setActiveTab('transactions');
                setTrxStatusFilter('pending');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                pendingCount > 0
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/20 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
              title="Klik untuk melihat transaksi yang menunggu persetujuan (ACC)"
            >
              <Bell className={`w-4 h-4 ${pendingCount > 0 ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
              <span>
                {pendingCount > 0 ? `${pendingCount} Transaksi Baru Menunggu ACC` : 'Tidak Ada Pending'}
              </span>
            </div>

            {/* Tombol Refresh */}
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => loadDashboardData(false)}
              disabled={isRefreshing}
              className={`text-xs ${isRefreshing ? 'opacity-60' : ''}`}
            >
              {isRefreshing ? 'Memperbarui...' : 'Segarkan Data'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={FileText}
              onClick={() => setActivePage('editor')}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white"
            >
              Kembali ke Editor
            </Button>
          </div>
        </div>

        {/* Info Banner Aturan Bisnis */}
        <div className="rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 p-4 text-white shadow-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-200 flex items-center gap-1.5">
              <span>SOP Persetujuan Akun Pro:</span>
              <span className="font-normal text-blue-200">
                Sistem tidak memiliki hak mengubah status user secara otomatis
              </span>
            </h4>
            <p className="text-blue-100/90 leading-relaxed">
              Setiap user yang mengajukan upgrade dari <strong>Mode Free ke Mode Pro</strong> akan berstatus{' '}
              <strong className="text-amber-300">Pending</strong>. Admin bertugas mengecek bukti pembayaran / mutasi transfer, lalu menekan tombol <strong>"ACC & Aktifkan Pro" (Checklist)</strong> untuk mengubah status user menjadi Pro dan membuka hak unduh PDF mereka.
            </p>
          </div>
        </div>

        {/* 4 Kartu KPI Metrik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Pengguna */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pengguna</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {overview?.users?.total || 0}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span className="text-blue-600 font-semibold">{overview?.users?.pro || 0} Pro</span>
                <span>•</span>
                <span className="text-slate-500">{overview?.users?.free || 0} Free</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Menunggu ACC Admin (Pending) */}
          <div className={`rounded-2xl p-5 border shadow-xs flex items-center justify-between transition-all ${
            pendingCount > 0
              ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200/90'
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Menunggu ACC Admin</p>
              <h3 className="text-2xl font-extrabold text-amber-900 mt-1">
                {pendingCount}
              </h3>
              <p className="text-[11px] text-amber-700 mt-1">
                {pendingCount > 0 ? 'Perlu tindakan verifikasi' : 'Semua transaksi beres'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              pendingCount > 0 ? 'bg-amber-500 text-white shadow-md' : 'bg-amber-100 text-amber-700'
            }`}>
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Transaksi Disetujui (Paid) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transaksi Disetujui (Paid)</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                {overview?.transactions?.paid || 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Dari total {overview?.transactions?.total || 0} pengajuan
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Total Pendapatan Masuk */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pendapatan Diterima</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatRupiah(overview?.transactions?.revenue || 0)}
              </h3>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Terverifikasi di database
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Navigasi Utama: Transaksi vs User Management */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 pt-4 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'transactions'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Transaksi & Persetujuan (ACC)</span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-extrabold">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-700 bg-white rounded-t-xl shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Manajemen Data Pengguna & Plan</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-semibold">
                  {usersList.length}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: TRANSAKSI & PERSETUJUAN */}
          {activeTab === 'transactions' && (
            <div className="p-6 space-y-4">
              {/* Filter & Search Bar Transaksi */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Order ID, Nama Pengguna, atau Email..."
                    value={trxSearch}
                    onChange={(e) => setTrxSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* Filter Status */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'Semua Transaksi' },
                    { id: 'pending', label: `Menunggu ACC (${pendingCount})`, highlight: pendingCount > 0 },
                    { id: 'paid', label: 'Disetujui (Paid)' },
                    { id: 'failed', label: 'Ditolak (Failed)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setTrxStatusFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        trxStatusFilter === filter.id
                          ? filter.highlight
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabel Transaksi */}
              <div className="border border-slate-200/90 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order ID & Waktu</th>
                      <th className="py-3 px-4">Pelanggan</th>
                      <th className="py-3 px-4">Paket & Nominal</th>
                      <th className="py-3 px-4">Metode & Bukti</th>
                      <th className="py-3 px-4">Status Transaksi</th>
                      <th className="py-3 px-4 text-center">Tindakan Admin (ACC)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-400">
                          Tidak ada data transaksi yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((trx) => {
                        let parsedDetails = null;
                        try {
                          parsedDetails = typeof trx.payment_details === 'string'
                            ? JSON.parse(trx.payment_details)
                            : trx.payment_details;
                        } catch (_) {}

                        const isPending = trx.status === 'pending';
                        const isPaid = trx.status === 'paid';
                        const isFailed = trx.status === 'failed' || trx.status === 'cancelled';

                        return (
                          <tr
                            key={trx.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isPending ? 'bg-amber-50/30 font-medium' : ''
                            }`}
                          >
                            {/* Order ID & Tanggal */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-slate-900 block">
                                {trx.order_id}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatDate(trx.created_at)}
                              </span>
                            </td>

                            {/* User Data */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                  {trx.user_name ? trx.user_name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block truncate max-w-[150px]">
                                    {trx.user_name}
                                  </span>
                                  <span className="text-[11px] text-slate-500 truncate max-w-[150px] block">
                                    {trx.user_email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Paket & Nominal */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-800 block">
                                {trx.plan_name}
                              </span>
                              <span className="text-blue-700 font-extrabold text-xs">
                                {formatRupiah(trx.amount)}
                              </span>
                            </td>

                            {/* Metode Pembayaran & Bukti */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                                  {trx.payment_method}
                                </span>
                                {parsedDetails?.senderName && (
                                  <p className="text-[10px] text-slate-600">
                                    Pengirim: <strong>{parsedDetails.senderName}</strong>
                                  </p>
                                )}
                                {trx.payment_proof && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPreviewProofUrl(trx.payment_proof);
                                      setSelectedProofTrx(trx);
                                    }}
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Lihat Struk/Bukti</span>
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Status Transaksi */}
                            <td className="py-3.5 px-4">
                              {isPending && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                                  <Clock className="w-3 h-3 animate-spin" /> Menunggu ACC
                                </span>
                              )}
                              {isPaid && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Disetujui (PRO)
                                </span>
                              )}
                              {isFailed && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                                  <XCircle className="w-3 h-3" /> Ditolak
                                </span>
                              )}
                              {trx.admin_notes && (
                                <p className="text-[10px] text-slate-400 mt-1 italic max-w-xs truncate" title={trx.admin_notes}>
                                  Catatan: {trx.admin_notes}
                                </p>
                              )}
                            </td>

                            {/* Tindakan Admin */}
                            <td className="py-3.5 px-4 text-center">
                              {isPending ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  {/* Tombol Checklist ACC */}
                                  <button
                                    type="button"
                                    onClick={() => handleApproveTransaction(trx.order_id, trx.user_name)}
                                    disabled={actionLoadingId === `approve-${trx.order_id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
                                    title="Persetujuan Checklist: Mengubah transaksi menjadi Paid dan mengaktifkan akun Pro user"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>ACC & Aktifkan Pro</span>
                                  </button>

                                  {/* Tombol Tolak */}
                                  <button
                                    type="button"
                                    onClick={() => openRejectModal(trx)}
                                    className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Tolak pembayaran"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : isPaid ? (
                                <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Sudah Aktif Pro
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  Transaksi Dibatalkan
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MANAJEMEN USER */}
          {activeTab === 'users' && (
            <div className="p-6 space-y-4">
              {/* Filter & Search Bar User */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Pengguna berdasarkan Nama atau Email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* Filter Plan */}
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'Semua Status' },
                    { id: 'pro', label: 'Mode Pro' },
                    { id: 'free', label: 'Mode Free' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setUserPlanFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userPlanFilter === filter.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabel Pengguna */}
              <div className="border border-slate-200/90 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Nama & Email</th>
                      <th className="py-3 px-4">Role Akses</th>
                      <th className="py-3 px-4">Status Plan Saat Ini</th>
                      <th className="py-3 px-4 text-center">Checklist Ubah Plan (Free / Pro)</th>
                      <th className="py-3 px-4 text-center">CV Terbuat</th>
                      <th className="py-3 px-4">Terdaftar Sejak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-10 text-slate-400">
                          Tidak ada pengguna ditemukan.
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => {
                        const isUserPro = u.plan_status === 'pro';
                        const isUserAdmin = u.role === 'admin';

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                              #{u.id}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                                  {u.name ? u.name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                                    {u.name}
                                  </span>
                                  <span className="text-[11px] text-slate-500 truncate max-w-[180px] block">
                                    {u.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Role Akses */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                                    isUserAdmin
                                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  {u.role || 'user'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserRole(u.id, u.name, u.role)}
                                  disabled={actionLoadingId === `role-${u.id}`}
                                  className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                                  title="Ubah peran admin/user"
                                >
                                  (ubah)
                                </button>
                              </div>
                            </td>

                            {/* Status Plan Badge */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                  isUserPro
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                              >
                                {isUserPro ? (
                                  <>
                                    <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                                    PRO MEMBER
                                  </>
                                ) : (
                                  'FREE PLAN'
                                )}
                              </span>
                            </td>

                            {/* Checklist Toggle Plan Langsung oleh Admin */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleUserPlan(u.id, u.name, u.plan_status)}
                                disabled={actionLoadingId === `plan-${u.id}`}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                                  isUserPro
                                    ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                                title={
                                  isUserPro
                                    ? 'Klik untuk menurunkan status ke FREE'
                                    : 'Klik Checklist untuk langsung mengaktifkan status PRO'
                                }
                              >
                                {isUserPro ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Status PRO (Klik reset)</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Aktifkan Pro (Checklist)</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* CV Terbuat */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="font-bold text-slate-700">{u.cv_count || 0}</span>
                              <span className="text-[10px] text-slate-400 ml-1">CV</span>
                            </td>

                            {/* Terdaftar Sejak */}
                            <td className="py-3.5 px-4 text-[11px] text-slate-500">
                              {formatDate(u.created_at)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL PREVIEW BUKTI TRANSFER PEMBAYARAN */}
      <Modal
        isOpen={!!previewProofUrl}
        onClose={() => {
          setPreviewProofUrl(null);
          setSelectedProofTrx(null);
        }}
        title="Pengecekan Bukti Transfer Pembayaran"
        size="md"
      >
        <div className="space-y-4">
          {selectedProofTrx && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p>
                <strong>Order ID:</strong> {selectedProofTrx.order_id}
              </p>
              <p>
                <strong>Pengirim / Pelanggan:</strong> {selectedProofTrx.user_name} ({selectedProofTrx.user_email})
              </p>
              <p>
                <strong>Nominal Pembelian:</strong> {formatRupiah(selectedProofTrx.amount)} ({selectedProofTrx.payment_method})
              </p>
            </div>
          )}

          <div className="max-h-[60vh] overflow-auto rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center p-2">
            {previewProofUrl ? (
              <img
                src={previewProofUrl}
                alt="Bukti Transfer Pembayaran"
                className="max-w-full h-auto object-contain rounded-lg shadow-sm"
              />
            ) : (
              <p className="text-xs text-slate-400">Bukti pembayaran tidak ditemukan.</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPreviewProofUrl(null);
                setSelectedProofTrx(null);
              }}
              className="text-xs"
            >
              Tutup
            </Button>

            {selectedProofTrx && selectedProofTrx.status === 'pending' && (
              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={() => {
                  handleApproveTransaction(selectedProofTrx.order_id, selectedProofTrx.user_name);
                  setPreviewProofUrl(null);
                  setSelectedProofTrx(null);
                }}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                ACC Pembayaran Ini Sekarang
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* MODAL TOLAK TRANSAKSI */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setTrxToReject(null);
        }}
        title="Tolak Transaksi Pembayaran"
        size="sm"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              Transaksi <strong className="font-mono">{trxToReject?.order_id}</strong> akan ditolak. Status pengguna tetap mode <strong>Free</strong>.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Alasan Penolakan:
            </label>
            <textarea
              rows="3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              placeholder="Contoh: Bukti transfer tidak jelas atau nominal tidak sesuai."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectModalOpen(false);
                setTrxToReject(null);
              }}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={rejecting}
              icon={X}
              onClick={handleConfirmReject}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Tolak Transaksi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
