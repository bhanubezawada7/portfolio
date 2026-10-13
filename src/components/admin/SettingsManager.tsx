import React, { useState } from 'react';
import { Settings, Save, Check, UploadCloud, Eye } from 'lucide-react';
import { Button } from '../common/Button';
import { MediaUploader } from './MediaUploader';
import { saveSiteSettings } from '../../repositories/portfolioRepo';
import type { SiteSettings } from '../../types';

interface SettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [saving, setSaving] = useState(false);
  const [showPortraitUploader, setShowPortraitUploader] = useState(false);
  const [showResumeUploader, setShowResumeUploader] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await saveSiteSettings(formData);
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = (section: keyof SiteSettings['sectionVisibility']) => {
    setFormData(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section]
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Website & Profile Configuration
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure identity, hero branding, contact endpoints, and public section visibility.
          </p>
        </div>

        <Button
          type="submit"
          size="sm"
          variant="primary"
          loading={saving}
          icon={savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? 'Settings Saved!' : 'Save All Changes'}
        </Button>
      </div>

      {/* Identity & Basic Info */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-3">
          1. Identity & Contact Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Owner Name
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Email
            </label>
            <input
              type="email"
              value={formData.primaryEmail}
              onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="9618624877"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={formData.whatsAppNumber}
              onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
              placeholder="919618624877"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Location / City
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Vijayawada, Andhra Pradesh, India"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Hero & Branding */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-3">
          2. Hero Section Branding
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Professional Headline
          </label>
          <input
            type="text"
            value={formData.heroHeadline}
            onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Short Hero Bio
          </label>
          <textarea
            rows={2}
            value={formData.heroBio}
            onChange={(e) => setFormData({ ...formData, heroBio: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Availability Status Banner
          </label>
          <input
            type="text"
            value={formData.availabilityStatus}
            onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>

        {/* Hero Portrait Cloudinary Uploader */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Hero Portrait Photo URL
            </label>
            <button
              type="button"
              onClick={() => setShowPortraitUploader(!showPortraitUploader)}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{showPortraitUploader ? 'Hide Uploader' : 'Upload New Portrait'}</span>
            </button>
          </div>

          <input
            type="text"
            value={formData.heroPortrait}
            onChange={(e) => setFormData({ ...formData, heroPortrait: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
          />

          {showPortraitUploader && (
            <MediaUploader
              allowedTypes="images"
              onUploadSuccess={(asset) => {
                setFormData(prev => ({ ...prev, heroPortrait: asset.secureUrl }));
                setShowPortraitUploader(false);
              }}
            />
          )}
        </div>

        {/* Resume Cloudinary Uploader */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Active Resume PDF URL
            </label>
            <button
              type="button"
              onClick={() => setShowResumeUploader(!showResumeUploader)}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{showResumeUploader ? 'Hide Uploader' : 'Upload New Resume PDF'}</span>
            </button>
          </div>

          <input
            type="text"
            value={formData.resumeUrl}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
          />

          {showResumeUploader && (
            <MediaUploader
              allowedTypes="all"
              onUploadSuccess={(asset) => {
                setFormData(prev => ({ ...prev, resumeUrl: asset.secureUrl }));
                setShowResumeUploader(false);
              }}
            />
          )}
        </div>
      </div>

      {/* About & Objective */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-3">
          3. About & Objective
        </h4>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Career Objective
          </label>
          <textarea
            rows={2}
            value={formData.careerObjective}
            onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Detailed Biography
          </label>
          <textarea
            rows={3}
            value={formData.aboutFullBio}
            onChange={(e) => setFormData({ ...formData, aboutFullBio: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>
      </div>

      {/* Section Visibility Toggles */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          4. Public Section Visibility Controls
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(formData.sectionVisibility).map(([section, isVisible]) => (
            <label
              key={section}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => handleToggleSection(section as keyof SiteSettings['sectionVisibility'])}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-semibold capitalize text-slate-300">
                {section} Section
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          loading={saving}
          icon={savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? 'Settings Saved!' : 'Save All Settings'}
        </Button>
      </div>
    </form>
  );
};
