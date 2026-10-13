import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ExternalLink, Calendar, Layers, Code2 } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title} maxWidth="2xl">
      <div className="space-y-6">
        {/* Thumbnail if available */}
        {project.thumbnail && (
          <div className="rounded-xl overflow-hidden border border-slate-800 relative aspect-video bg-slate-950">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge variant="accent">{project.category}</Badge>
            </div>
          </div>
        )}

        {/* Project Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>
              {project.startDate && project.completionDate
                ? `${project.startDate} – ${project.completionDate}`
                : project.startDate || 'Engineering Project'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {project.sourceCodeUrl && (
              <a
                href={project.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Summary & Description */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Project Overview
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {project.summary}
          </p>
          {project.description && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Technologies list */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Key Hardware & Technologies
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 text-indigo-300 border border-indigo-500/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Gallery images if present */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Project Media
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {project.gallery.map((imgUrl, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-slate-800 aspect-video">
                  <img src={imgUrl} alt={`${project.title} media ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
