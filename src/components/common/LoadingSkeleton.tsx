import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-6 border border-slate-800 animate-pulse flex flex-col gap-4"
        >
          <div className="h-44 bg-slate-800/80 rounded-xl w-full" />
          <div className="h-6 bg-slate-800/80 rounded w-3/4" />
          <div className="h-4 bg-slate-800/60 rounded w-full" />
          <div className="h-4 bg-slate-800/60 rounded w-5/6" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-slate-800/80 rounded-full w-16" />
            <div className="h-6 bg-slate-800/80 rounded-full w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SectionSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
      <div className="h-8 bg-slate-800 rounded w-48 mx-auto" />
      <div className="h-4 bg-slate-800 rounded w-72 mx-auto" />
      <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
};
