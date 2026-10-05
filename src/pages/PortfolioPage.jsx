import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { usePrintResume } from '../hooks/usePrintResume';
import { exportService } from '../services/exportService';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Download,
  Share2,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Send,
} from 'lucide-react';
import { Github, Linkedin } from '../components/common/BrandIcons';


export function PortfolioPage() {
  const { resumeData, showToast } = useResume();
  const { personalInfo, experiences, education, skills, projects, certifications, theme } =
    resumeData;

  const primaryColor = theme?.primaryColor || '#4f46e5';
  const { printResume, isPrinting } = usePrintResume(personalInfo?.fullName);

  // Filter project by tag
  const [selectedTag, setSelectedTag] = useState('Semua');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  // Contact form state
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Kumpulkan semua tags unik dari projects
  const allTags = React.useMemo(() => {
    const set = new Set();
    projects?.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return ['Semua', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    if (selectedTag === 'Semua') return projects || [];
    return (projects || []).filter((p) => p.tags?.includes(selectedTag));
  }, [projects, selectedTag]);

  const handleSharePortfolio = () => {
    const link = exportService.generateShareableLink(resumeData);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showToast('Tautan Portofolio Live berhasil disalin!');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const mailto = `mailto:${personalInfo.email || 'hello@example.com'}?subject=${encodeURIComponent(
      contactSubject || 'Peluang Kolaborasi'
    )}&body=${encodeURIComponent(contactMessage)}`;
    window.location.href = mailto;
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner Share Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Website Portofolio Online Anda Siap Dipublikasikan</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSharePortfolio}
            className="flex items-center gap-1.5 text-indigo-300 hover:text-white transition font-medium cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Salin Link Publik
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-16 sm:py-24">
        {/* Subtle Decorative Background Orbs */}
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Avatar Photo */}
          {personalInfo.avatarUrl ? (
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden p-1 shadow-xl mb-6 ring-4 ring-slate-100 bg-white">
              <img
                src={personalInfo.avatarUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-6"
              style={{ backgroundColor: primaryColor }}
            >
              {(personalInfo.fullName || 'P').charAt(0)}
            </div>
          )}

          {/* Availability Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Terbuka untuk Peluang Kerja / Freelance</span>
          </div>

          {/* Name & Job Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p
            className="text-xl sm:text-2xl font-bold mt-2 tracking-tight"
            style={{ color: primaryColor }}
          >
            {personalInfo.jobTitle || 'Professional Title'}
          </p>

          {/* Bio Summary */}
          {personalInfo.bio && (
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
              {personalInfo.bio}
            </p>
          )}

          {/* Location & Contact Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 mt-4">
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.phone}
              </span>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button
              variant="primary"
              size="lg"
              icon={Download}
              onClick={printResume}
              loading={isPrinting}
            >
              Unduh CV (PDF)
            </Button>
            <a
              href="#contact"
              className="inline-flex items-center justify-center font-medium rounded-lg px-5 py-2.5 text-base border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer"
            >
              Hubungi Saya
            </a>
            <Button
              variant="ghost"
              size="lg"
              icon={Share2}
              onClick={handleSharePortfolio}
            >
              Bagikan
            </Button>
          </div>

          {/* Social Links Icons */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-slate-100">
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-2xs"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-2xs"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition shadow-2xs"
                title="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects Gallery Section */}
      {projects?.length > 0 && (
        <section id="projects" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Karya & Portofolio
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Proyek Unggulan
              </h2>
            </div>

            {/* Tag Filter Pills */}
            {allTags.length > 2 && (
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Project Image Banner */}
                {proj.image ? (
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {proj.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                        ★ Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="h-44 w-full bg-gradient-to-tr from-slate-100 to-indigo-50/50 flex items-center justify-center text-slate-400">
                    <Code2 className="w-10 h-10 stroke-1 text-slate-300" />
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{proj.date || 'Project'}</span>
                      {proj.subtitle && (
                        <span className="text-indigo-600 font-medium truncate max-w-[150px]">
                          {proj.subtitle}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {proj.title}
                    </h3>

                    {proj.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    {/* Tags */}
                    {proj.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {proj.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline ml-3"
                          >
                            <Github className="w-3.5 h-3.5" />
                            Source
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveProjectModal(proj)}
                        className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Matrix Section */}
      {skills?.length > 0 && (
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: primaryColor }}
              >
                Keahlian & Teknologi
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Tech Stack & Keahlian
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skills.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{sk.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{sk.level}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: primaryColor,
                        width:
                          sk.level === 'Expert'
                            ? '95%'
                            : sk.level === 'Advanced'
                            ? '80%'
                            : sk.level === 'Intermediate'
                            ? '65%'
                            : '40%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Timeline Section */}
      {experiences?.length > 0 && (
        <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
              Riwayat Karier
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Pengalaman Profesional
            </h2>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-6 sm:pl-8 group">
                <div
                  className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-xs group-hover:scale-125 transition-transform"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-base font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {exp.startDate} — {exp.isCurrent ? 'Sekarang' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-indigo-600 mt-0.5">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights?.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-xs text-slate-600 list-disc list-outside ml-4">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Section */}
      {(education?.length > 0 || certifications?.length > 0) && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Education */}
              {education?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    Pendidikan Formal
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-sm text-slate-900">{edu.institution}</h4>
                          <span className="text-xs text-slate-500 font-mono">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-1">
                          {edu.degree} {edu.fieldOfStudy ? `dalam ${edu.fieldOfStudy}` : ''}
                        </p>
                        {edu.score && (
                          <span className="inline-block mt-2 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {edu.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Sertifikasi & Kredensial
                  </h3>
                  <div className="space-y-4">
                    {certifications.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                        <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                        <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                          <span>{c.issuer}</span>
                          <span className="text-slate-400 font-mono">{c.issueDate}</span>
                        </div>
                        {c.credentialUrl && (
                          <a
                            href={c.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline mt-2"
                          >
                            Verifikasi Sertifikat <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Mari Terhubung
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Tertarik Bekerja Sama?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3">
              Kirimkan pesan langsung melalui email atau hubungi melalui kanal di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Contact details */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Email</div>
                    <div className="text-xs text-white font-medium">{personalInfo.email || 'Belum diisi'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Telepon</div>
                    <div className="text-xs text-white font-medium">{personalInfo.phone || 'Belum diisi'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Lokasi</div>
                    <div className="text-xs text-white font-medium">{personalInfo.location || 'Indonesia'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick message form */}
            <form
              onSubmit={handleSendMessage}
              className="md:col-span-7 bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subjek Pesan
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tawaran Proyek / Fulltime Opportunity"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Pesan Anda
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pesan Anda kepada saya..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Send}
                className="w-full"
              >
                Kirim Pesan via Email
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <Modal
        isOpen={!!activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
        title={activeProjectModal?.title || 'Detail Proyek'}
        maxWidth="max-w-2xl"
      >
        {activeProjectModal && (
          <div className="space-y-4">
            {activeProjectModal.image && (
              <img
                src={activeProjectModal.image}
                alt={activeProjectModal.title}
                className="w-full h-56 object-cover rounded-xl border border-slate-100"
              />
            )}
            {activeProjectModal.subtitle && (
              <p className="text-sm font-semibold text-indigo-600">
                {activeProjectModal.subtitle}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeProjectModal.description}
            </p>
            {activeProjectModal.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activeProjectModal.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              {activeProjectModal.liveUrl && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={ExternalLink}
                  onClick={() => window.open(activeProjectModal.liveUrl, '_blank')}
                >
                  Buka Live Demo
                </Button>
              )}
              {activeProjectModal.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={Github}
                  onClick={() => window.open(activeProjectModal.githubUrl, '_blank')}
                >
                  Repositori GitHub
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
