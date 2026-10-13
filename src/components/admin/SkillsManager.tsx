import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, Cpu } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { saveSkill, deleteSkill } from '../../repositories/portfolioRepo';
import type { Skill } from '../../types';

interface SkillsManagerProps {
  skills: Skill[];
  onRefresh: () => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, onRefresh }) => {
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingSkill({
      id: `skill-${Date.now()}`,
      name: '',
      category: 'Programming',
      proficiency: 80,
      published: true,
      sortOrder: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete skill "${name}"?`)) return;
    try {
      await deleteSkill(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete skill: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name) return;
    setSaving(true);
    try {
      await saveSkill(editingSkill as Skill);
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
            <Cpu className="w-5 h-5 text-indigo-400" />
            Skills & Technical Capabilities
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage categorized technical, programming, and marketing skills.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="glass-card rounded-xl p-4 border border-slate-800 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-bold text-slate-200">{skill.name}</p>
              <span className="text-[11px] text-indigo-400 font-medium">{skill.category}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleEdit(skill)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(skill.id, skill.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill?.name ? `Edit Skill: ${editingSkill.name}` : 'Add New Skill'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={editingSkill?.name || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              placeholder="e.g. Python, Social Media Marketing"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={editingSkill?.category || 'Programming'}
              onChange={(e: any) =>
                setEditingSkill({ ...editingSkill, category: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value="Programming">Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Creative & Productivity">Creative & Productivity</option>
              <option value="Technical Tools">Technical Tools</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={editingSkill?.published ?? true}
              onChange={(e) =>
                setEditingSkill({ ...editingSkill, published: e.target.checked })
              }
              className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
            />
            <span className="text-xs font-medium text-slate-300">Published (Visible on site)</span>
          </label>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving} icon={<Check className="w-4 h-4" />}>
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
