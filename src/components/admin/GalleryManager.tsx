import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { MediaUploader } from './MediaUploader';
import { saveGalleryItem, deleteGalleryItem } from '../../repositories/portfolioRepo';
import type { GalleryItem } from '../../types';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  onRefresh: () => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({ gallery, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<Partial<GalleryItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingItem({
      id: `gal-${Date.now()}`,
      title: '',
      url: '',
      mediaType: 'image',
      altText: '',
      caption: '',
      category: 'General',
      featured: false,
      published: true,
      sortOrder: gallery.length + 1
    });
    setIsModalOpen(true);
    setShowUploader(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
    setShowUploader(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete gallery item "${title}"?`)) return;
    try {
      await deleteGalleryItem(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete gallery item: ${err.message}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.url) {
      alert('Title and Media URL are required.');
      return;
    }
    setSaving(true);
    try {
      await saveGalleryItem(editingItem as GalleryItem);
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
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            Media Gallery Management
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload images and videos to Cloudinary and organize gallery showcases.
          </p>
        </div>
        <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          Add Media
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-slate-900">
              {item.mediaType === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" />
              ) : (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 right-2">
                <span className="p-1 rounded bg-slate-900/80 text-white text-[10px] font-bold uppercase">
                  {item.mediaType}
                </span>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <div>
                <p className="text-sm font-bold text-slate-200 truncate">{item.title}</p>
                <p className="text-[11px] text-slate-400 truncate">{item.caption || item.category}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    item.published ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                  }`}
                >
                  {item.published ? 'Published' : 'Draft'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.title ? `Edit: ${editingItem.title}` : 'Add New Media Item'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {showUploader && (
            <MediaUploader
              onUploadSuccess={(asset) => {
                setEditingItem(prev => ({
                  ...prev,
                  url: asset.secureUrl,
                  mediaType: asset.resourceType === 'video' ? 'video' : 'image',
                  title: prev?.title || asset.originalFilename?.replace(/\.[^/.]+$/, '') || 'Media Asset'
                }));
              }}
            />
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Media URL *
            </label>
            <input
              type="url"
              required
              value={editingItem?.url || ''}
              onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Media Type
              </label>
              <select
                value={editingItem?.mediaType || 'image'}
                onChange={(e: any) =>
                  setEditingItem({ ...editingItem, mediaType: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={editingItem?.category || 'General'}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                placeholder="Engineering, Profile, Marketing"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Caption
            </label>
            <input
              type="text"
              value={editingItem?.caption || ''}
              onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Alt Text (Accessibility)
            </label>
            <input
              type="text"
              value={editingItem?.altText || ''}
              onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
              placeholder="Brief description for screen readers"
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
              Save Media
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
