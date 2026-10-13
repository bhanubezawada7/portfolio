import React from 'react';
import { Mail, MessageCircle, ArrowUp } from 'lucide-react';
import type { SiteSettings } from '../../types';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const ownerName = settings?.ownerName || 'Bhausri Bezawada';
  const email = settings?.primaryEmail || 'bhanubezawada1@gmail.com';
  const whatsapp = settings?.whatsAppNumber || '919618624877';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-slate-800 bg-slate-950/80 pt-16 pb-12 overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Summary */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/20">
                BB
              </div>
              <span className="font-bold text-lg text-slate-100">{ownerName}</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Electrical & Electronics Engineering Graduate (SRGEC) with expertise in web technologies, digital marketing campaigns, and AI productivity tools.
            </p>
          </div>

          {/* Navigation Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-indigo-400 transition-colors">Technical Skills</a></li>
              <li><a href="#education" className="hover:text-indigo-400 transition-colors">Education & Academics</a></li>
              <li><a href="#experience" className="hover:text-indigo-400 transition-colors">Experience & Internships</a></li>
              <li><a href="#projects" className="hover:text-indigo-400 transition-colors">Engineering Projects</a></li>
              <li><a href="#gallery" className="hover:text-indigo-400 transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Verified Contact Connect */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/bhanu-sri-bezawada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-400 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {ownerName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with React, TypeScript & Firebase</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors inline-flex items-center gap-1.5"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
