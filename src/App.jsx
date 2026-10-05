import React from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { activePage, toastMessage, clearToast } = useResume();

  const renderPage = () => {
    switch (activePage) {
      case 'preview':
        return <PreviewPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'editor':
      default:
        return <EditorPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">{renderPage()}</main>
      {activePage !== 'portfolio' && <Footer />}
      <Toast toast={toastMessage} onClose={clearToast} />
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <AppContent />
    </ResumeProvider>
  );
}
