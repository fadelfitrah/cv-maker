import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Plus, Trash2, Cpu, Wrench } from 'lucide-react';

export function SkillsForm() {
  const { resumeData, addSkill, deleteSkill, updateSkill } = useResume();
  const skills = resumeData.skills || [];

  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Frontend');
  const [skillLevel, setSkillLevel] = useState('Advanced');

  const categories = [
    'Frontend',
    'Backend',
    'Mobile',
    'UI/UX & Desain',
    'DevOps & Cloud',
    'Database',
    'Tools & Software',
    'Soft Skills',
    'Bahasa Pemrograman',
    'Lainnya',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!skillName.trim()) return;
    addSkill(skillCategory, skillName.trim(), skillLevel);
    setSkillName('');
  };

  // Kelompokkan skill berdasarkan kategori
  const groupedSkills = skills.reduce((acc, curr) => {
    const cat = curr.category || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(curr);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Keahlian & Keterampilan (Skills)</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Tambahkan keahlian teknis (hard skills) dan interpersonal (soft skills) Anda.
        </p>
      </div>

      {/* Form Tambah Skill Cepat */}
      <form
        onSubmit={handleAddSkill}
        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Nama Keahlian"
            placeholder="e.g. React.js, Figma, SQL..."
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />
          <Select
            label="Kategori"
            value={skillCategory}
            onChange={(e) => setSkillCategory(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Tingkat Kemahiran"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            options={levels.map((l) => ({ value: l, label: l }))}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="sm" icon={Plus}>
            Tambah Keahlian
          </Button>
        </div>
      </form>

      {/* Daftar Skill Terkelompok */}
      {skills.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl">
          <Cpu className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500">Belum ada keahlian ditambahkan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([cat, list]) => (
            <div key={cat} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                {cat} ({list.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {list.map((sk) => (
                  <Badge
                    key={sk.id}
                    variant="primary"
                    size="sm"
                    onRemove={() => deleteSkill(sk.id)}
                    className="flex items-center gap-1.5"
                  >
                    <span>{sk.name}</span>
                    <span className="text-[10px] text-indigo-500 bg-white/80 px-1 rounded">
                      {sk.level}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
