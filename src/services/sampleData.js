/**
 * Preset data contoh untuk kemudahan testing & demonstrasi
 */

export const SAMPLE_ENGINEER_DATA = {
  personalInfo: {
    fullName: 'Budi Pratama, S.Kom',
    jobTitle: 'Senior Fullstack Software Engineer',
    email: 'budi.pratama@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta Selatan, Indonesia',
    website: 'https://budipratama.dev',
    linkedin: 'https://linkedin.com/in/budipratama',
    github: 'https://github.com/budipratama',
    bio: 'Software Engineer berpengalaman 5+ tahun dalam merancang dan membangun arsitektur aplikasi web berskala tinggi dengan React, Node.js, dan Cloud Native. Terbiasa memimpin tim teknik, mengoptimalkan performa web, dan menerapkan praktik CI/CD serta clean architecture.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'PT Solusi Teknologi Nusantara',
      role: 'Lead Frontend Engineer',
      location: 'Jakarta, Indonesia',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      description: 'Memimpin tim engineering frontend (6 developer) dalam membangun platform e-commerce enterprise dengan transaksi jutaan per hari.',
      highlights: [
        'Meningkatkan skor Core Web Vitals (LCP) hingga 45% dan menurunkan bundle size sebesar 32%',
        'Mengimplementasikan Micro-Frontend architecture menggunakan Vite Module Federation',
        'Mengurangi bug regresi hingga 60% dengan implementasi Automated Testing (Vitest & Playwright)'
      ]
    },
    {
      id: 'exp-2',
      company: 'Kreatif Digital Inovasi',
      role: 'Fullstack Developer',
      location: 'Bandung, Indonesia',
      startDate: '2020-03',
      endDate: '2022-12',
      isCurrent: false,
      description: 'Mengembangkan sistem manajemen SaaS B2B menggunakan Next.js, Express.js, PostgreSQL, dan Redis.',
      highlights: [
        'Membangun modul analitik data realtime dengan WebSockets dan Redis Pub/Sub',
        'Mengintegrasikan payment gateway multi-bank (Midtrans, Xendit) dengan tingkat keberhasilan 99.8%'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Institut Teknologi Bandung (ITB)',
      degree: 'Sarjana Komputer (S.Kom)',
      fieldOfStudy: 'Teknik Informatika',
      startDate: '2016-08',
      endDate: '2020-07',
      score: 'IPK 3.82 / 4.00 (Cum Laude)',
      description: 'Fokus pada Rekayasa Perangkat Lunak Terdistribusi dan Sistem Basis Data. Asisten Laboratorium Pemrograman Web.'
    }
  ],
  skills: [
    { id: 'sk-1', category: 'Frontend', name: 'React.js / Next.js', level: 'Expert' },
    { id: 'sk-2', category: 'Frontend', name: 'TypeScript', level: 'Expert' },
    { id: 'sk-3', category: 'Frontend', name: 'Tailwind CSS', level: 'Expert' },
    { id: 'sk-4', category: 'Backend', name: 'Node.js / Express', level: 'Advanced' },
    { id: 'sk-5', category: 'Backend', name: 'PostgreSQL / MongoDB', level: 'Advanced' },
    { id: 'sk-6', category: 'DevOps & Tools', name: 'Docker & Kubernetes', level: 'Intermediate' },
    { id: 'sk-7', category: 'DevOps & Tools', name: 'Git / CI/CD Actions', level: 'Advanced' },
    { id: 'sk-8', category: 'Soft Skills', name: 'Team Leadership & Agile Scrum', level: 'Expert' }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'CloudPulse - DevOps Monitoring Dashboard',
      subtitle: 'Realtime Server & Container Metrics Visualizer',
      description: 'Platform dashboard monitoring metrik infrastruktur cloud secara realtime dengan integrasi Prometheus & OpenTelemetry.',
      tags: ['React', 'TypeScript', 'Tailwind', 'Go', 'Docker'],
      liveUrl: 'https://cloudpulse-demo.dev',
      githubUrl: 'https://github.com/budipratama/cloudpulse',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      featured: true,
      date: '2024'
    },
    {
      id: 'proj-2',
      title: 'EduTrack LMS & AI Tutor',
      subtitle: 'Platform Edukasi Terpadu Berbasis AI',
      description: 'Sistem manajemen belajar interaktif dilengkapi asisten AI untuk rekomendasi materi kuis adaptif.',
      tags: ['Next.js', 'PostgreSQL', 'OpenAI API', 'Tailwind'],
      liveUrl: 'https://edutrack-lms.dev',
      githubUrl: 'https://github.com/budipratama/edutrack',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
      featured: true,
      date: '2023'
    },
    {
      id: 'proj-3',
      title: 'PayFlow Fast Checkout Engine',
      subtitle: 'Payment Gateway Aggregator Widget',
      description: 'Komponen checkout instan berbobot ringan (<15kb) yang mendukung QRIS, Virtual Account, dan e-Wallet.',
      tags: ['React', 'Web Components', 'REST API'],
      liveUrl: 'https://payflow-widget.dev',
      githubUrl: 'https://github.com/budipratama/payflow',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      featured: false,
      date: '2023'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: '2023-06',
      expiryDate: '2026-06',
      credentialUrl: 'https://aws.amazon.com/verification',
      credentialId: 'AWS-PSA-982341'
    },
    {
      id: 'cert-2',
      name: 'Meta Certified Front-End Developer Professional',
      issuer: 'Meta / Coursera',
      issueDate: '2022-04',
      expiryDate: '',
      credentialUrl: 'https://coursera.org/verify/meta-frontend',
      credentialId: 'META-FE-772910'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'Bahasa Indonesia', proficiency: 'Native / Penutur Asli' },
    { id: 'lang-2', name: 'Bahasa Inggris', proficiency: 'Professional Working Proficiency' }
  ],
  customSections: [],
  theme: {
    templateId: 'modern',
    primaryColor: '#4f46e5',
    fontFamily: 'sans',
    fontSize: 'normal',
    showPhoto: true,
  }
};

export const SAMPLE_DESIGNER_DATA = {
  personalInfo: {
    fullName: 'Sarah Annisa, S.Ds',
    jobTitle: 'Product Designer & Design System Lead',
    email: 'sarah.annisa@designstudio.io',
    phone: '+62 821-9988-7766',
    location: 'Yogyakarta, Indonesia',
    website: 'https://sarahannisa.design',
    linkedin: 'https://linkedin.com/in/sarahannisa',
    github: 'https://dribbble.com/sarahannisa',
    bio: 'Product Designer dengan pengalaman 4+ tahun dalam membangun pengalaman digital manusiawi yang berorientasi pada data dan hasil bisnis. Spesialis dalam riset pengguna, visual craft, micro-interactions, serta perancangan scalable design systems.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  experiences: [
    {
      id: 'exp-d1',
      company: 'FinTech Maju Bersama',
      role: 'Senior Product Designer',
      location: 'Jakarta (Remote)',
      startDate: '2022-05',
      endDate: '',
      isCurrent: true,
      description: 'Memimpin redesain aplikasi perbankan digital untuk 2.5 juta pengguna aktif bulanan.',
      highlights: [
        'Meningkatkan tingkat konversi onboarding pinjaman modal usaha hingga 28%',
        'Membangun fondasi Design System "Prisma" yang menghemat waktu iterasi tim 35%'
      ]
    }
  ],
  education: [
    {
      id: 'edu-d1',
      institution: 'Institut Seni Indonesia (ISI) Yogyakarta',
      degree: 'Sarjana Desain (S.Ds)',
      fieldOfStudy: 'Desain Komunikasi Visual',
      startDate: '2017-09',
      endDate: '2021-08',
      score: 'IPK 3.88',
      description: 'Lulusan terbaik jurusan DKV. Fokus pada Human-Centered Interaction Design.'
    }
  ],
  skills: [
    { id: 'sk-d1', category: 'Design', name: 'Figma & FigJam', level: 'Expert' },
    { id: 'sk-d2', category: 'Design', name: 'Design Systems & Tokens', level: 'Expert' },
    { id: 'sk-d3', category: 'Research', name: 'User Research & Usability Testing', level: 'Advanced' },
    { id: 'sk-d4', category: 'Interaction', name: 'Framer / Prototyping', level: 'Advanced' },
    { id: 'sk-d5', category: 'Frontend Basics', name: 'HTML & Tailwind CSS', level: 'Intermediate' }
  ],
  projects: [
    {
      id: 'proj-d1',
      title: 'Prisma Design System 2.0',
      subtitle: 'Scalable Component Library for Mobile & Web',
      description: 'Komprehensif design system lintas platform dengan 120+ komponen aksesibel sesuai standar WCAG AA.',
      tags: ['Figma', 'Design Tokens', 'Storybook', 'Accessibility'],
      liveUrl: 'https://prisma-design-system.io',
      githubUrl: 'https://figma.com/@sarahannisa',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
      featured: true,
      date: '2024'
    }
  ],
  certifications: [
    {
      id: 'cert-d1',
      name: 'Google UX Design Professional Certificate',
      issuer: 'Google',
      issueDate: '2021-10',
      expiryDate: '',
      credentialUrl: 'https://coursera.org/verify/google-ux',
      credentialId: 'GGL-UX-493012'
    }
  ],
  languages: [
    { id: 'lang-d1', name: 'Bahasa Indonesia', proficiency: 'Native' },
    { id: 'lang-d2', name: 'Bahasa Inggris', proficiency: 'Fluent' }
  ],
  customSections: [],
  theme: {
    templateId: 'creative',
    primaryColor: '#0284c7',
    fontFamily: 'sans',
    fontSize: 'normal',
    showPhoto: true,
  }
};
