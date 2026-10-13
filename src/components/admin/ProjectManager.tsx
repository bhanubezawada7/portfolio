import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, FolderKanban, UploadCloud } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { MediaUploader } from './MediaUploader';
import { saveProject, deleteProject } from '../../repositories/portfolioRepo';
import type { Project } from '../../types';

interface ProjectManagerProps {
  projects: Project[];
  onRefresh: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ projects, onRefresh }) => {
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingProject({
      id: `proj-${Date.now()}`,
      title: '',
      slug: '',
      summary: '',
      description: '',
      category: 'Engineering',
      technologies: [],
      thumbnail: '',
      gallery: [],
      liveDemoUrl: null,
      sourceCodeUrl: null,
      featured: false,
      published: true,
      sortOrder: projects.length + 1,
      startDate: '2024',
      completionDate: '2024'
    });
    setIsModalOpen(true);
    setError(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
    setError(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProject(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete project: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.summary) {
      setError('Title and Summary are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const slug =
      editingProject.slug?.trim() ||
      editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    try {
      await saveProject({
        ...(editingProject as Project),
        slug
      });
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            Projects Showcase Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, update, and manage engineering and software project records.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          New Project
        </Button>
      </div>

      {/* Projects Table / Cards */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Technologies</th>
                <th className="px-4 py-3 text-center">Featured</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-850/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {proj.thumbnail && (
                        <img
                          src={proj.thumbnail}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-200">{proj.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">/{proj.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                      {proj.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-300">
                      {proj.technologies.slice(0, 3).join(', ')}
                      {proj.technologies.length > 3 && ` +${proj.technologies.length - 3}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {proj.featured ? (
                      <span className="text-xs text-emerald-400 font-bold">Yes</span>
                    ) : (
                      <span className="text-xs text-slate-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        proj.published
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {proj.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(proj)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject?.title ? `Edit: ${editingProject.title}` : 'Add New Project'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={editingProject?.title || ''}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, title: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slug (URL identifier)
              </label>
              <input
                type="text"
                value={editingProject?.slug || ''}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, slug: e.target.value })
                }
                placeholder="auto-generated-from-title"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={editingProject?.category || 'Engineering'}
                onChange={(e: any) =>
                  setEditingProject({ ...editingProject, category: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              >
                <option value="Engineering">Engineering</option>
                <option value="Web Development">Web Development</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={editingProject?.technologies?.join(', ') || ''}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })
                }
                placeholder="Arduino, Solar Power, Sensors"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Short Summary *
            </label>
            <textarea
              required
              rows={2}
              value={editingProject?.summary || ''}
              onChange={(e) =>
                setEditingProject({ ...editingProject, summary: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detailed Description & Specifications
            </label>
            <textarea
              rows={3}
              value={editingProject?.description || ''}
              onChange={(e) =>
                setEditingProject({ ...editingProject, description: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          {/* Thumbnail & Cloudinary Uploader */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Thumbnail URL
              </label>
              <button
                type="button"
                onClick={() => setShowUploader(!showUploader)}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{showUploader ? 'Hide Uploader' : 'Upload via Cloudinary'}</span>
              </button>
            </div>

            <input
              type="text"
              value={editingProject?.thumbnail || ''}
              onChange={(e) =>
                setEditingProject({ ...editingProject, thumbnail: e.target.value })
              }
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
            />

            {showUploader && (
              <MediaUploader
                allowedTypes="images"
                onUploadSuccess={(asset) => {
                  setEditingProject(prev => ({ ...prev, thumbnail: asset.secureUrl }));
                  setShowUploader(false);
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Repository URL (Optional)
              </label>
              <input
                type="url"
                value={editingProject?.sourceCodeUrl || ''}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, sourceCodeUrl: e.target.value || null })
                }
                placeholder="Leave blank if unavailable"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Live Demo URL (Optional)
              </label>
              <input
                type="url"
                value={editingProject?.liveDemoUrl || ''}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, liveDemoUrl: e.target.value || null })
                }
                placeholder="Leave blank if unavailable"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProject?.featured || false}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, featured: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-300">Featured on Top</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProject?.published ?? true}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, published: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
              />
              <span className="text-xs font-medium text-slate-300">Published (Visible Publicly)</span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              icon={<Check className="w-4 h-4" />}
            >
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
