import React, { useState, useMemo } from 'react';
import { Search, ExternalLink, ArrowUpRight, Cpu, Code2, FolderKanban } from 'lucide-react';
import { Badge } from '../common/Badge';
import { EmptyState } from '../common/EmptyState';
import { ProjectModal } from './ProjectModal';
import type { Project } from '../../types';

interface ProjectsSectionProps {
  projects: Project[];
}

const getProjectImage = (project: Project): string => {
  if (project.thumbnail && !project.thumbnail.includes('photo-1558441719') && !project.thumbnail.includes('photo-1509391365360')) {
    return project.thumbnail;
  }
  if (project.slug.includes('ev') || project.title.toLowerCase().includes('ev') || project.title.toLowerCase().includes('ultracapacitor')) {
    return '/assets/projects/ev_charging_prototype.jpg';
  }
  if (project.slug.includes('solar') || project.title.toLowerCase().includes('solar')) {
    return '/assets/projects/solar_tracker.jpg';
  }
  return '/assets/projects/arduino_distance.jpg';
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const publishedProjects = useMemo(() => {
    return projects.filter(p => p.published).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [projects]);

  // Distinct categories available in published records
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    publishedProjects.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [publishedProjects]);

  // Filtered by category and search
  const filteredProjects = useMemo(() => {
    return publishedProjects.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.technologies.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [publishedProjects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
            <FolderKanban className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Portfolio Showcase
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Engineering & Technical Projects
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Hardware prototypes, microcontroller designs, and sustainable technology implementations.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-500'
                    : 'bg-white/80 dark:bg-slate-900/90 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/90 dark:border-slate-800 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tools..."
              className="w-full bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description={
              searchQuery
                ? `No projects matching "${searchQuery}". Try adjusting your keywords.`
                : 'There are no published projects in this category.'
            }
            actionLabel={searchQuery ? 'Clear Search' : undefined}
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="group relative overflow-hidden rounded-3xl bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-black/40 flex flex-col justify-between cursor-pointer hover:border-indigo-500/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950">
                    {project.thumbnail || getProjectImage(project) ? (
                      <img
                        src={getProjectImage(project)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (project.slug.includes('ev') || project.title.toLowerCase().includes('ev') || project.title.toLowerCase().includes('ultracapacitor')) {
                            target.src = '/assets/projects/ev_charging_prototype.jpg';
                          } else if (project.slug.includes('solar') || project.title.toLowerCase().includes('solar')) {
                            target.src = '/assets/projects/solar_tracker.jpg';
                          } else {
                            target.src = '/assets/projects/arduino_distance.jpg';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-indigo-500">
                        <Cpu className="w-12 h-12 opacity-60" />
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <Badge variant="accent">{project.category}</Badge>
                    </div>

                    {project.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="success">Featured</Badge>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">
                      {project.summary}
                    </p>
                  </div>
                </div>

                {/* Footer with technologies and actions */}
                <div className="px-6 pb-6 pt-2">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">
                      View Details & Specs →
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {project.sourceCodeUrl && (
                        <a
                          href={project.sourceCodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Source Code"
                        >
                          <Code2 className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={activeProject}
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
