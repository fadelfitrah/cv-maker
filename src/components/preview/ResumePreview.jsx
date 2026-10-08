import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
import { usePrintResume } from "../../hooks/usePrintResume";
import { useAuth } from "../../context/AuthContext";
import { TemplateRenderer } from "../templates/TemplateRenderer";
import { TEMPLATE_LIST } from "../../types/resume";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Printer,
  FileDown,
  Lock,
  LayoutTemplate,
} from "lucide-react";

export function ResumePreview({ isFullscreen = false }) {
  const { resumeData, updateTheme } = useResume();
  const [zoomLevel, setZoomLevel] = useState(isFullscreen ? 0.95 : 0.78);
  const { printResume, isPrinting } = usePrintResume(
    resumeData.personalInfo?.fullName,
  );
  const { isPro, isLoggedIn, openAuthModal, openUpgradeModal } = useAuth();

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.45));
  const handleResetZoom = () => setZoomLevel(isFullscreen ? 0.95 : 0.78);
  const handlePrintOrDownload = () => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    if (!isPro) {
      openUpgradeModal();
      return;
    }
    printResume();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Top Floating Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white border-b border-slate-200 no-print">
        {/* Template Quick Selector */}
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-indigo-600" />
          <select
            value={resumeData.theme?.templateId || "modern"}
            onChange={(e) => updateTheme({ templateId: e.target.value })}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {TEMPLATE_LIST.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-2 text-slate-600">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white ml-1 cursor-pointer"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Print / Download Button */}
        <button
          type="button"
          onClick={handlePrintOrDownload}
          disabled={isPrinting}
          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition shadow-xs cursor-pointer"
        >
          {isPro ? (
            <Printer className="w-3.5 h-3.5" />
          ) : (
            <Lock className="w-3.5 h-3.5" />
          )}
          {isPro ? <span>Cetak PDF</span> : <span>Unduh PDF (Pro)</span>}
        </button>
      </div>

      {/* A4 Sheet Container Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="print:scale-100 print:transform-none"
        >
          <div className="a4-sheet">
            <TemplateRenderer data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}
