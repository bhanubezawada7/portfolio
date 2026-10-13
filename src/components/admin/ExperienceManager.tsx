import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, Briefcase } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { saveExperience, deleteExperience } from '../../repositories/portfolioRepo';
import type { Experience } from '../../types';

interface ExperienceManagerProps {
  experience: Experience[];
  onRefresh: () => void;
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({ experience, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingItem({
      id: `exp-${Date.now()}`,
      role: '',
      organization: '',
      type: 'work',
      duration: '',
      period: '',
      description: '',
      responsibilities: [],
      technologies: [],
      sortOrder: experience.length + 1,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Experience) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, role: string) => {
    if (!window.confirm(`Delete experience record "${role}"?`)) return;
    try {
      await deleteExperience(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete record: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.role || !editingItem?.organization) return;
    setSaving(true);
    try {
      await saveExperience(editingItem as Experience);
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Experience & Internships Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage professional roles, digital marketing work, and industrial technical internships.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experience.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    item.type === 'work'
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-xs text-slate-400">{item.duration || item.period}</span>
              </div>
              <h4 className="text-base font-bold text-slate-100 mt-1">{item.role}</h4>
              <p className="text-xs text-indigo-400 font-medium">{item.organization}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.role)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.role ? `Edit: ${editingItem.role}` : 'Add Experience Record'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={editingItem?.role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                placeholder="e.g. Social Media Manager"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Organization / Company *
              </label>
              <input
                type="text"
                required
                value={editingItem?.organization || ''}
                onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                placeholder="e.g. Smart Bridge"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Experience Type
              </label>
              <select
                value={editingItem?.type || 'work'}
                onChange={(e: any) =>
                  setEditingItem({ ...editingItem, type: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              >
                <option value="work">Professional Work</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration / Period
              </label>
              <input
                type="text"
                value={editingItem?.duration || editingItem?.period || ''}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, duration: e.target.value, period: e.target.value })
                }
                placeholder="e.g. 2 Months, 2024"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Overview
            </label>
            <textarea
              rows={2}
              value={editingItem?.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Key Responsibilities (One per line)
            </label>
            <textarea
              rows={3}
              value={editingItem?.responsibilities?.join('\n') || ''}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  responsibilities: e.target.value.split('\n').filter(s => s.trim())
                })
              }
              placeholder="Manage daily campaigns&#10;Develop content calendars"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Technologies / Tools (Comma separated)
            </label>
            <input
              type="text"
              value={editingItem?.technologies?.join(', ') || ''}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })
              }
              placeholder="Python, Canva, Marketing Strategy"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={editingItem?.published ?? true}
              onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
            />
            <span className="text-xs font-medium text-slate-300">Published</span>
          </label>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving} icon={<Check className="w-4 h-4" />}>
              Save Experience
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
