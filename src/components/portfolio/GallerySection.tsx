import React, { useState } from 'react';
import { Eye, X, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../common/Badge';
import type { GalleryItem } from '../../types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const publishedItems = gallery
    .filter(g => g.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const categories = ['All', ...Array.from(new Set(publishedItems.map(g => g.category || 'General')))];

  const filteredItems =
    selectedCategory === 'All'
      ? publishedItems
      : publishedItems.filter(g => (g.category || 'General') === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveMediaIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveMediaIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextMedia = () => {
    if (activeMediaIndex === null) return;
    setActiveMediaIndex((activeMediaIndex + 1) % filteredItems.length);
  };

  const prevMedia = () => {
    if (activeMediaIndex === null) return;
    setActiveMediaIndex((activeMediaIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Visual Media & Moments
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Media Gallery & Work Highlights
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Snapshots of engineering laboratory work, digital marketing campaigns, and achievements.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-500'
                    : 'bg-white/80 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Responsive Grid with natural aspect ratios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative overflow-hidden rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-black/40 cursor-pointer hover:border-indigo-500/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                {item.mediaType === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.altText || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}

                {/* Hover overlay with icon */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="p-3 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transform scale-75 group-hover:scale-100 transition-transform">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                {/* Media Type indicator */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="p-1.5 rounded-lg bg-slate-950/70 text-slate-300 backdrop-blur-md inline-flex">
                    {item.mediaType === 'video' ? <Video className="w-3.5 h-3.5 text-pink-400" /> : <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />}
                  </span>
                </div>
              </div>

              {/* Caption & Info */}
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {item.title}
                  </h4>
                  {item.category && (
                    <Badge variant="default" size="sm">
                      {item.category}
                    </Badge>
                  )}
                </div>
                {item.caption && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{item.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeMediaIndex !== null && filteredItems[activeMediaIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors z-20"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation controls */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevMedia();
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextMedia();
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Active Media Container */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredItems[activeMediaIndex].mediaType === 'video' ? (
              <video
                src={filteredItems[activeMediaIndex].url}
                className="max-h-[70vh] max-w-full rounded-2xl shadow-2xl border border-slate-800"
                controls
                autoPlay
              />
            ) : (
              <img
                src={filteredItems[activeMediaIndex].url}
                alt={filteredItems[activeMediaIndex].altText || filteredItems[activeMediaIndex].title}
                className="max-h-[70vh] max-w-full rounded-2xl shadow-2xl border border-slate-800 object-contain"
              />
            )}

            <div className="mt-4 text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                {filteredItems[activeMediaIndex].title}
              </h3>
              {filteredItems[activeMediaIndex].caption && (
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
                  {filteredItems[activeMediaIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
