import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';

const normalizeOklchColors = (element, includeDescendants = true) => {
  const oklchPattern =
    /oklch\(\s*([+-]?(?:\d*\.)?\d+)(%)?\s+([+-]?(?:\d*\.)?\d+)(%)?\s+([+-]?(?:\d*\.)?\d+)(?:deg)?(?:\s*\/\s*([+-]?(?:\d*\.)?\d+)(%)?)?\s*\)/gi;
  const convertColor = (match, lightness, lightnessPercent, chroma, chromaPercent, hue, alpha, alphaPercent) => {
    const l = Number(lightnessPercent ? lightness / 100 : lightness);
    const c = Number(chromaPercent ? chroma * 0.004 : chroma);
    const angle = (Number(hue) * Math.PI) / 180;
    const a = c * Math.cos(angle);
    const b = c * Math.sin(angle);
    const lRoot = l + 0.3963377774 * a + 0.2158037573 * b;
    const mRoot = l - 0.1055613458 * a - 0.0638541728 * b;
    const sRoot = l - 0.0894841775 * a - 1.291485548 * b;
    const lLinear = lRoot ** 3;
    const mLinear = mRoot ** 3;
    const sLinear = sRoot ** 3;
    const channels = [
      4.0767416621 * lLinear - 3.3077115913 * mLinear + 0.2309699292 * sLinear,
      -1.2684380046 * lLinear + 2.6097574011 * mLinear - 0.3413193965 * sLinear,
      -0.0041960863 * lLinear - 0.7034186147 * mLinear + 1.707614701 * sLinear,
    ].map((value) => {
      const clamped = Math.min(1, Math.max(0, value));
      const srgb =
        clamped <= 0.0031308
          ? clamped * 12.92
          : 1.055 * clamped ** (1 / 2.4) - 0.055;
      return Math.round(srgb * 255);
    });

    if (alpha === undefined) {
      return `rgb(${channels.join(', ')})`;
    }
    const opacity = Number(alphaPercent ? alpha / 100 : alpha);
    return `rgba(${channels.join(', ')}, ${opacity})`;
  };

  const allElements = includeDescendants
    ? [element, ...element.querySelectorAll('*')]
    : [element];
  allElements.forEach((node) => {
    const computedStyle = window.getComputedStyle(node);
    Array.from(computedStyle).forEach((property) => {
      const value = computedStyle.getPropertyValue(property);
      if (value.includes('oklch(')) {
        node.style.setProperty(
          property,
          value.replace(oklchPattern, convertColor),
          'important',
        );
      }
    });
  });
};

/**
 * Service untuk export PDF, Markdown, serta URL Sharing hash untuk portfolio online.
 */

export const exportService = {
  /**
   * Render template CV menjadi PDF A4 yang dapat diunduh langsung dari browser.
   */
  downloadPdf: async (data) => {
    if (!data?.personalInfo) {
      throw new Error('Data CV tidak tersedia untuk diekspor.');
    }
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const renderNode = document.createElement('div');
    renderNode.className = 'a4-sheet';
    renderNode.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;width:210mm;min-height:297mm;overflow:visible;';
    renderNode.innerHTML = renderToStaticMarkup(
      createElement(TemplateRenderer, { data }),
    );
    document.body.appendChild(renderNode);
    const originalRootStyle = document.documentElement.style.cssText;
    const originalBodyStyle = document.body.style.cssText;

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await Promise.all(
        Array.from(renderNode.querySelectorAll('img')).map((image) => {
          if (image.complete) return Promise.resolve();
          return new Promise((resolve) => {
            const timeout = window.setTimeout(resolve, 10000);
            const finishLoading = () => {
              window.clearTimeout(timeout);
              resolve();
            };
            image.addEventListener('load', finishLoading, { once: true });
            image.addEventListener('error', finishLoading, { once: true });
          });
        }),
      );
      normalizeOklchColors(renderNode);
      normalizeOklchColors(document.documentElement, false);
      normalizeOklchColors(document.body, false);

      const canvas = await html2canvas(renderNode, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        windowWidth: 794,
        imageTimeout: 10000,
      });
      if (!canvas.width || !canvas.height) {
        throw new Error('Gagal merender data CV menjadi PDF.');
      }
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      const pageHeight = Math.ceil((canvas.width * 297) / 210);
      const pageCount = Math.ceil(canvas.height / pageHeight);

      for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
        const sourceY = pageIndex * pageHeight;
        const sliceHeight = Math.min(
          Math.ceil(pageHeight),
          canvas.height - sourceY,
        );
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const context = pageCanvas.getContext('2d');
        if (!context) {
          throw new Error('Gagal menyiapkan halaman PDF.');
        }
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        context.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight,
        );

        if (pageIndex > 0) {
          pdf.addPage();
        }
        const imageData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const imageHeight = (sliceHeight * 210) / canvas.width;
        if (
          !Number.isFinite(imageHeight) ||
          !Number.isFinite(pageCanvas.width) ||
          !Number.isFinite(pageCanvas.height) ||
          !imageData.startsWith('data:image/jpeg')
        ) {
          throw new Error(
            `Dimensi halaman PDF tidak valid (${pageCanvas.width}x${pageCanvas.height}).`,
          );
        }
        pdf.addImage(imageData, 'JPEG', 0, 0, 210, imageHeight);
      }

      const candidateName = data.personalInfo.fullName || 'Resume';
      const cleanName = candidateName
        .trim()
        .replace(/[^\w-]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'Resume';
      pdf.save(`CV_${cleanName}.pdf`);
    } finally {
      document.documentElement.style.cssText = originalRootStyle;
      document.body.style.cssText = originalBodyStyle;
      renderNode.remove();
    }
  },

  /**
   * Mengonversi struktur CV menjadi format Markdown terstruktur
   */
  exportToMarkdown: (data) => {
    const { personalInfo, experiences, education, skills, projects, certifications } = data;

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
