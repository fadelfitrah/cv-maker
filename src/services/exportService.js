/**
 * Service untuk menangani pencetakan CV (PDF via browser print),
 * export Markdown, serta URL Sharing hash untuk portfolio online.
 */

export const exportService = {
  /**
   * Menyiapkan halaman dan memicu dialog Print bawaan browser.
   * Format print sudah dioptimalkan melalui @media print di CSS untuk ukuran A4.
   */
  printCV: (candidateName = 'Resume') => {
    const originalTitle = document.title;
    const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');
    document.title = `CV_${cleanName}`;

    // Berikan sedikit jeda agar DOM render selesai jika ada transisi
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 150);
  },

  /**
   * Mengonversi struktur CV menjadi format Markdown terstruktur
   */
  exportToMarkdown: (data) => {
    const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;

    let md = `# ${personalInfo.fullName || 'Nama Lengkap'}\n`;
    md += `**${personalInfo.jobTitle || 'Profesi'}**\n\n`;

    const contacts = [
      personalInfo.email && `📧 ${personalInfo.email}`,
      personalInfo.phone && `📱 ${personalInfo.phone}`,
      personalInfo.location && `📍 ${personalInfo.location}`,
      personalInfo.website && `🌐 [Website](${personalInfo.website})`,
      personalInfo.linkedin && `🔗 [LinkedIn](${personalInfo.linkedin})`,
      personalInfo.github && `💻 [GitHub](${personalInfo.github})`,
    ].filter(Boolean);

    md += `${contacts.join(' | ')}\n\n`;

    if (personalInfo.bio) {
      md += `## Ringkasan Profesional\n${personalInfo.bio}\n\n`;
    }

    if (experiences?.length > 0) {
      md += `## Pengalaman Kerja\n`;
      experiences.forEach((exp) => {
        md += `### ${exp.role} - ${exp.company}\n`;
        md += `*${exp.startDate} - ${exp.isCurrent ? 'Sekarang' : exp.endDate} | ${exp.location || ''}*\n\n`;
        if (exp.description) md += `${exp.description}\n\n`;
        if (exp.highlights?.length > 0) {
          exp.highlights.forEach((h) => {
            md += `- ${h}\n`;
          });
          md += `\n`;
        }
      });
    }

    if (education?.length > 0) {
      md += `## Pendidikan\n`;
      education.forEach((edu) => {
        md += `### ${edu.institution}\n`;
        md += `**${edu.degree} ${edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ''}** | ${edu.startDate} - ${edu.endDate}\n`;
        if (edu.score) md += `*${edu.score}*\n`;
        if (edu.description) md += `${edu.description}\n`;
        md += `\n`;
      });
    }

    if (skills?.length > 0) {
      md += `## Keterampilan (Skills)\n`;
      const byCategory = skills.reduce((acc, curr) => {
        const cat = curr.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(`${curr.name}${curr.level ? ` (${curr.level})` : ''}`);
        return acc;
      }, {});

      Object.entries(byCategory).forEach(([cat, list]) => {
        md += `- **${cat}**: ${list.join(', ')}\n`;
      });
      md += `\n`;
    }

    if (projects?.length > 0) {
      md += `## Portofolio & Proyek Pilihan\n`;
      projects.forEach((proj) => {
        md += `### ${proj.title}\n`;
        if (proj.subtitle) md += `*${proj.subtitle}*\n\n`;
        if (proj.description) md += `${proj.description}\n\n`;
        if (proj.tags?.length > 0) md += `**Teknologi:** ${proj.tags.join(', ')}\n\n`;
        const links = [
          proj.liveUrl && `[Live Demo](${proj.liveUrl})`,
          proj.githubUrl && `[Source Code](${proj.githubUrl})`,
        ].filter(Boolean);
        if (links.length > 0) md += `${links.join(' | ')}\n\n`;
      });
    }

    if (certifications?.length > 0) {
      md += `## Sertifikasi & Lisensi\n`;
      certifications.forEach((c) => {
        md += `- **${c.name}** – ${c.issuer} (${c.issueDate})\n`;
      });
      md += `\n`;
    }

    return md;
  },

  /**
   * Mengunduh file Markdown
   */
  downloadMarkdownFile: (data) => {
    const md = exportService.exportToMarkdown(data);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${(data.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  /**
   * Mengompres data ke Base64 URL Safe string untuk tautan shareable portfolio langsung
   */
  generateShareableLink: (data) => {
    try {
      const jsonStr = JSON.stringify(data);
      const encoded = btoa(encodeURIComponent(jsonStr));
      const url = new URL(window.location.origin + window.location.pathname);
      url.hash = `portfolio-share=${encoded}`;
      return url.toString();
    } catch (err) {
      console.error('Error generating share link:', err);
      return '';
    }
  },

  /**
   * Mendekode data CV dari hash URL jika dibuka oleh pengunjung/recruiter
   */
  parseSharedDataFromUrl: () => {
    try {
      const hash = window.location.hash;
      if (hash.includes('portfolio-share=')) {
        const encoded = hash.split('portfolio-share=')[1];
        if (encoded) {
          const jsonStr = decodeURIComponent(atob(encoded));
          return JSON.parse(jsonStr);
        }
      }
    } catch (err) {
      console.warn('Could not parse shared portfolio from URL hash:', err);
    }
    return null;
  }
};
