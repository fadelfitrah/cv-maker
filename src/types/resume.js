/**
 * Definisi Schema & Default State untuk CV dan Portfolio Maker
 */

export const INITIAL_RESUME_STATE = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    bio: '',
    avatarUrl: '',
    avatarShape: 'circle', // 'circle' | 'square'
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  theme: {
    templateId: 'modern', // 'modern' | 'minimalist' | 'executive' | 'tech' | 'creative'
    primaryColor: '#4f46e5', // Indigo default
    fontFamily: 'sans', // 'sans' | 'serif' | 'mono'
    fontSize: 'normal', // 'compact' | 'normal' | 'large'
    showPhoto: true,
  },
};

export const TEMPLATE_LIST = [
  {
    id: 'modern',
    name: 'Modern Pro',
    description: 'Tata letak elegan dan bersih dengan aksen warna modern. Cocok untuk semua profesi.',
    category: 'Universal',
    badge: 'Populer',
  },
  {
    id: 'minimalist',
    name: 'Minimalist ATS',
    description: 'Format hitam-putih ultra bersih yang dioptimalkan untuk sistem ATS recruiter.',
    category: 'ATS-Friendly',
    badge: 'Rekomendasi ATS',
  },
  {
    id: 'tech',
    name: 'Tech & Developer',
    description: 'Didesain khusus untuk programmer, menampilkan stack teknologi, repositori, dan link demo.',
    category: 'Teknologi',
    badge: 'Developer',
  },
  {
    id: 'executive',
    name: 'Executive Elite',
    description: 'Gaya formal berkelas dengan tipografi serif untuk posisi manajerial dan konsultan.',
    category: 'Corporate',
    badge: 'Senior/Lead',
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Format dua kolom dengan sidebar kontras untuk desainer, kreator, dan UI/UX.',
    category: 'Kreatif',
    badge: 'Desain',
  },
];

export const COLOR_PALETTES = [
  { name: 'Indigo Blue', value: '#4f46e5', bg: 'bg-indigo-600' },
  { name: 'Sky Cyan', value: '#0284c7', bg: 'bg-sky-600' },
  { name: 'Emerald Green', value: '#059669', bg: 'bg-emerald-600' },
  { name: 'Rose Red', value: '#e11d48', bg: 'bg-rose-600' },
  { name: 'Purple Violet', value: '#7c3aed', bg: 'bg-violet-600' },
  { name: 'Amber Gold', value: '#d97706', bg: 'bg-amber-600' },
  { name: 'Slate Gray', value: '#334155', bg: 'bg-slate-700' },
  { name: 'Pitch Black', value: '#0f172a', bg: 'bg-slate-900' },
];
