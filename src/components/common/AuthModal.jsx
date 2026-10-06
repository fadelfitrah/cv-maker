import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useResume } from '../../context/ResumeContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { LogIn, UserPlus, Sparkles, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loading,
    pendingRedirectPage,
  } = useAuth();

  const { setActivePage, showToast } = useResume();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLogin = authModalMode === 'login';

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError('Harap isi email dan password.');
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        showToast(`Selamat datang kembali, ${res.user.name}!`);
        resetForm();
        if (pendingRedirectPage) {
          setActivePage(pendingRedirectPage);
        } else {
          setActivePage('editor');
        }
      } else {
        setError(res.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Nama, email, dan password wajib diisi.');
        return;
      }
      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        return;
      }
      const res = await register(name, email, password);
      if (res.success) {
        showToast(`Pendaftaran berhasil! Selamat datang, ${res.user.name}.`);
        resetForm();
        if (pendingRedirectPage) {
          setActivePage(pendingRedirectPage);
        } else {
          setActivePage('editor');
        }
      } else {
        setError(res.message || 'Pendaftaran gagal. Silakan coba kembali.');
      }
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => {
        resetForm();
        closeAuthModal();
      }}
      title=""
      size="md"
    >
      <div className="-mt-3">
        {/* Header Visual Modern Biru & Putih */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 ring-4 ring-blue-50/50 shadow-sm">
            {isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun CV Maker'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {isLogin
              ? 'Masuk untuk mulai mengedit dan menyimpan CV profesional Anda.'
              : 'Daftar sekarang untuk mulai menyusun CV impian dalam hitungan menit.'}
          </p>

          {/* Toggle Tab */}
          <div className="flex bg-slate-100 p-1 rounded-xl mt-4 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setError('');
                setAuthModalMode('login');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isLogin
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setAuthModalMode('register');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daftar Baru
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {!isLogin && (
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <Input
            label="Alamat Email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20"
          >
            {isLogin ? 'Masuk Sekarang' : 'Daftar & Mulai Edit CV'}
          </Button>
        </form>

        {/* Demo Account Quick Fill Helper */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Akun Demo Uji Coba:</span>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setEmail('demo@cvmaker.com');
              setPassword('password123');
              setError('');
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Isi Demo (Free)
          </button>
        </div>
      </div>
    </Modal>
  );
}
