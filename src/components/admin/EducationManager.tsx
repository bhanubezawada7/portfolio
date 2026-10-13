import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, GraduationCap } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { saveEducation, deleteEducation } from '../../repositories/portfolioRepo';
import type { Education } from '../../types';

interface EducationManagerProps {
  education: Education[];
  onRefresh: () => void;
}

export const EducationManager: React.FC<EducationManagerProps> = ({ education, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<Partial<Education> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingItem({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      period: '2021 – 2025',
      grade: 'CGPA: 8.0',
      description: '',
      sortOrder: education.length + 1,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Education) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, degree: string) => {
    if (!window.confirm(`Delete record "${degree}"?`)) return;
    try {
      await deleteEducation(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete record: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.degree || !editingItem?.institution) return;
    setSaving(true);
    try {
      await saveEducation(editingItem as Education);
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
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Education Timeline Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage academic degrees, institutions, graduation dates, and CGPA scores.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          Add Academic Record
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-indigo-400">{item.period}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {item.grade}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-100 mt-1">{item.degree}</h4>
              <p className="text-xs text-slate-400">{item.institution} • {item.location}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id, item.degree)}
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
        title={editingItem?.degree ? `Edit: ${editingItem.degree}` : 'Add Academic Qualification'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Degree / Qualification *
            </label>
            <input
              type="text"
              required
              value={editingItem?.degree || ''}
              onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={editingItem?.institution || ''}
                onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={editingItem?.location || ''}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration / Period
              </label>
              <input
                type="text"
                value={editingItem?.period || ''}
                onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                placeholder="2021 – 2025"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Grade / CGPA
              </label>
              <input
                type="text"
                value={editingItem?.grade || ''}
                onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                placeholder="CGPA: 7.8"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & Coursework
            </label>
            <textarea
              rows={2}
              value={editingItem?.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
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
              Save Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
