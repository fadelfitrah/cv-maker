import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';
import { UpgradeModal } from './components/common/UpgradeModal';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboard } from './pages/AdminDashboard';

function AppContent() {
  const { activePage, setActivePage, toastMessage, clearToast } = useResume();
  const { isLoggedIn, openAuthModal } = useAuth();

  // Guard: Jika user mencoba masuk ke editor saat belum login, arahkan ke landing page dan munculkan modal login
  useEffect(() => {
    if (activePage === 'editor' && !isLoggedIn) {
      setActivePage('home');
      openAuthModal('login', 'editor');
    }
  }, [activePage, isLoggedIn, setActivePage, openAuthModal]);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <LandingPage />;
      case 'preview':
        return <PreviewPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'editor':
        // Pastikan hanya bisa diakses setelah login
        return isLoggedIn ? <EditorPage /> : <LandingPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="app-shell min-h-screen flex flex-col text-slate-900 selection:bg-blue-500 selection:text-white bg-slate-50/50">
      <Navbar />
      <main className="flex-1 flex flex-col">{renderPage()}</main>
      {activePage !== 'portfolio' && <Footer />}
      <Toast toast={toastMessage} onClose={clearToast} />
      <AuthModal />
      <UpgradeModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </AuthProvider>
  );
}
