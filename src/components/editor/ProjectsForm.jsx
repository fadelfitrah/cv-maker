import React from "react";
import { useResume } from "../../context/ResumeContext";
import { Input, Textarea } from "../common/Input";
import { Button } from "../common/Button";
import {
  Plus,
  Trash2,
  FolderGit2,
  Globe,
  FolderKanban,
  Image,
  Tag,
  Star,
} from "lucide-react";

export function ProjectsForm() {
  const { resumeData, addProject, updateProject, deleteProject } = useResume();
  const projects = resumeData.projects || [];

  const handleTagsChange = (projId, tagsString) => {
    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateProject(projId, { tags });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Proyek Portofolio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tampilkan proyek terbaik Anda yang akan ditampilkan di CV dan
            Website Portofolio.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={addProject}>
          Tambah Proyek
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">
            Belum ada proyek yang ditambahkan
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Proyek ini akan otomatis dimuat ke halaman Web Portofolio interaktif
            Anda!
          </p>
          <Button variant="outline" size="sm" icon={Plus} onClick={addProject}>
            Tambah Proyek Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 transition-all hover:border-slate-300"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Proyek #{index + 1}
                  </span>
                  {proj.featured && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-500" /> Featured
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteProject(proj.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  title="Hapus proyek ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Judul Proyek"
                  placeholder="e.g. CloudPulse Monitoring Dashboard"
                  value={proj.title}
                  onChange={(e) =>
                    updateProject(proj.id, { title: e.target.value })
                  }
                  required
                />
                <Input
                  label="Subjudul / Tagline Singkat"
                  placeholder="e.g. Realtime Server Metrics Visualizer"
                  value={proj.subtitle}
                  onChange={(e) =>
                    updateProject(proj.id, { subtitle: e.target.value })
                  }
                />
              </div>

              <Textarea
                label="Deskripsi Proyek"
                rows={3}
                placeholder="Jelaskan masalah yang diselesaikan, arsitektur teknis, dan fitur utama proyek..."
                value={proj.description}
                onChange={(e) =>
                  updateProject(proj.id, { description: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Stack Teknologi (Pisahkan dengan koma)"
                  placeholder="React, TypeScript, Tailwind, Go, Docker"
                  value={proj.tags ? proj.tags.join(", ") : ""}
                  onChange={(e) => handleTagsChange(proj.id, e.target.value)}
                  icon={Tag}
                  helperText="Contoh: React, Node.js, PostgreSQL"
                />
                <Input
                  label="Tahun Pengerjaan"
                  placeholder="e.g. 2024"
                  value={proj.date}
                  onChange={(e) =>
                    updateProject(proj.id, { date: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="URL Live Demo / Website"
                  placeholder="https://cloudpulse-demo.dev"
                  value={proj.liveUrl}
                  onChange={(e) =>
                    updateProject(proj.id, { liveUrl: e.target.value })
                  }
                  icon={Globe}
                />
                <Input
                  label="URL GitHub / Repositori"
                  placeholder="https://github.com/..."
                  value={proj.githubUrl}
                  onChange={(e) =>
                    updateProject(proj.id, { githubUrl: e.target.value })
                  }
                  icon={FolderGit2}
                />
                <Input
                  label="URL Gambar Banner / Preview"
                  placeholder="https://images.unsplash.com/..."
                  value={proj.image}
                  onChange={(e) =>
                    updateProject(proj.id, { image: e.target.value })
                  }
                  icon={Image}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!proj.featured}
                    onChange={(e) =>
                      updateProject(proj.id, { featured: e.target.checked })
                    }
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Tandai sebagai Proyek Unggulan (Featured Project)</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
