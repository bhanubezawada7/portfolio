import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, FileDown, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  resumeUrl?: string;
}

interface NavLinkItem {
  name: string;
  href: string;
  id: string;
}

// Magnetic Nav Link with cursor-pulling physics
interface MagneticLinkProps {
  link: NavLinkItem;
  isActive: boolean;
  isHomePage: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
}

const MagneticLink: React.FC<MagneticLinkProps> = ({
  link,
  isActive,
  isHomePage,
  onHoverStart,
  onHoverEnd
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull towards cursor with dampening factor
    const deltaX = Math.max(-10, Math.min(10, (e.clientX - centerX) * 0.35));
    const deltaY = Math.max(-8, Math.min(8, (e.clientY - centerY) * 0.35));
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverStart(link.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
    onHoverEnd();
  };

  return (
    <a
      ref={linkRef}
      href={isHomePage ? link.href : `/${link.href}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={`nav-link-${link.name.toLowerCase()}`}
      data-nav-id={link.id}
      data-active={isActive ? 'true' : 'false'}
      className={`relative px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-semibold tracking-wide transition-colors duration-200 select-none rounded-full ${
        isActive
          ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]'
          : 'text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      <span
        className="inline-block will-change-transform"
        style={{
          transform: isHovered
            ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
            : 'translate3d(0, 0, 0)',
          transition: isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.35s cubic-bezier(0.2, 0, 0, 1)'
        }}
      >
        {link.name}
      </span>
    </a>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  resumeUrl = '/assets/bhanu_resume.pdf'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [gliderStyle, setGliderStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const navRef = useRef<HTMLDivElement>(null);

  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, signOutUser } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks: NavLinkItem[] = [
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Education', href: '#education', id: 'education' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Contact', href: '#contact', id: 'contact' }
  ];

  // Dynamic sticky shrink & active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      if (!isHomePage) return;

      // Scroll spy to detect active section
      const sectionIds = navLinks.map((l) => l.id);
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Position the gliding indicator based on hoveredId or activeSection
  useEffect(() => {
    const updateGliderToElement = () => {
      if (!navRef.current) return;
      const targetId = hoveredId || activeSection;
      const targetEl = navRef.current.querySelector<HTMLAnchorElement>(
        `[data-nav-id="${targetId}"]`
      );

      if (targetEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        setGliderStyle({
          left: targetRect.left - navRect.left,
          width: targetRect.width,
          opacity: 1
        });
      } else {
        setGliderStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateGliderToElement();
    window.addEventListener('resize', updateGliderToElement);
    return () => window.removeEventListener('resize', updateGliderToElement);
  }, [hoveredId, activeSection]);

  const handleHoverStart = (id: string) => {
    setHoveredId(id);
  };

  const handleHoverEnd = () => {
    setHoveredId(null);
  };

  return (
    <header
      data-testid="navbar-floating-header"
      className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex flex-col items-center px-4 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300"
    >
      {/* Spacious Floating Glassmorphism Pill Container */}
      <div
        data-testid="navbar-pill"
        data-scrolled={scrolled ? 'true' : 'false'}
        className={`pointer-events-auto w-full max-w-6xl xl:max-w-7xl rounded-full transition-all duration-300 ease-out flex items-center justify-between border ${
          scrolled
            ? 'py-2 px-5 sm:px-8 bg-slate-950/80 dark:bg-slate-950/85 backdrop-blur-2xl border-indigo-400/35 dark:border-indigo-500/30 shadow-[0_14px_45px_rgba(0,0,0,0.6),0_0_25px_rgba(99,102,241,0.22)] scale-[0.98]'
            : 'py-3 sm:py-3.5 px-6 sm:px-9 bg-slate-900/60 dark:bg-slate-950/65 backdrop-blur-xl border-white/15 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.38),0_0_18px_rgba(99,102,241,0.12)]'
        }`}
        style={{
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Step 1: Logo/Name firmly aligned to FAR LEFT */}
        <div className="flex items-center justify-start shrink-0">
          <Link
            to="/"
            data-testid="navbar-brand-name"
            className="flex items-center gap-2.5 group focus:outline-none rounded-full px-2 py-1 select-none"
            aria-label="Bhanusri Bezawada Home"
          >
            {/* Glowing Metallic Accent Dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 shadow-[0_0_10px_#38bdf8] group-hover:scale-125 transition-transform duration-300 shrink-0" />

            {/* Clean Elegant Name */}
            <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-white group-hover:to-indigo-300 transition-all duration-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.3)] whitespace-nowrap">
              Bhanusri Bezawada
            </span>
          </Link>
        </div>

        {/* Step 2 & 3: Well-Spaced Menu Links in CENTER */}
        <nav
          ref={navRef}
          data-testid="navbar-desktop-menu"
          className="relative hidden lg:flex items-center justify-center gap-1.5 xl:gap-3 px-3.5 py-1.5 rounded-full bg-white/5 dark:bg-black/20 border border-white/5 mx-4"
        >
          {/* Gliding Underline with Glowing Center Dot */}
          <div
            data-testid="navbar-gliding-indicator"
            className="absolute bottom-1.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 transition-all duration-300 ease-out pointer-events-none shadow-[0_0_12px_#38bdf8]"
            style={{
              left: `${gliderStyle.left}px`,
              width: `${gliderStyle.width}px`,
              opacity: gliderStyle.opacity
            }}
          >
            {/* Gliding Glowing Dot */}
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
          </div>

          {navLinks.map((link) => (
            <MagneticLink
              key={link.name}
              link={link}
              isActive={activeSection === link.id}
              isHomePage={isHomePage}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </nav>

        {/* Step 4: Action Controls firmly on FAR RIGHT */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3.5 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-btn"
            className="p-2.5 rounded-full text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:outline-none cursor-pointer shadow-inner hover:scale-105 active:scale-95"
            aria-label={`Switch to ${theme === 'light' ? 'Dark Mode (Obsidian)' : 'Blue Mode (Royal Navy)'}`}
            title={`Switch to ${theme === 'light' ? 'Dark Mode (Obsidian Black)' : 'Blue Mode (Midnight Navy)'}`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Resume Download CTA Pill */}
          <a
            href={resumeUrl}
            download="Bhanu_Bezawada_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="navbar-resume-btn"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500/25 via-indigo-600/30 to-cyan-500/25 hover:from-indigo-500/40 hover:to-cyan-500/40 border border-indigo-400/40 hover:border-cyan-400/60 text-white shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer hover:scale-105 active:scale-95 select-none whitespace-nowrap"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-300" />
            <span>Resume</span>
          </a>

          {/* Admin or Login Link */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {isAdmin && (
                <Link
                  to="/admin"
                  data-testid="navbar-admin-btn"
                  className="p-2 rounded-full text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Admin Dashboard"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              )}
              <button
                onClick={signOutUser}
                data-testid="navbar-signout-btn"
                className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" data-testid="navbar-login-btn">
              <button
                className="p-2.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                title="Admin Portal Login"
                aria-label="Admin Portal Login"
              >
                <Shield className="w-4 h-4" />
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            data-testid="navbar-mobile-toggle"
            className="lg:hidden p-2.5 rounded-full text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:outline-none"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphic Dropdown Panel */}
      {isOpen && (
        <div
          data-testid="navbar-mobile-drawer"
          className="pointer-events-auto lg:hidden w-full max-w-sm mt-2 rounded-2xl p-4 bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)] animate-fadeIn transition-all"
          style={{
            WebkitBackdropFilter: 'blur(20px)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHomePage ? link.href : `/${link.href}`}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  activeSection === link.id
                    ? 'bg-indigo-500/20 text-cyan-300 border border-indigo-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              <a
                href={resumeUrl}
                download="Bhanu_Bezawada_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-xl text-center bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-400/40 text-white flex items-center justify-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5 text-cyan-300" />
                <span>Download Resume</span>
              </a>

              {user ? (
                <div className="flex gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex-1 py-2 text-xs font-semibold text-center rounded-xl bg-indigo-600 text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={signOutUser}
                    className="flex-1 py-2 text-xs font-semibold rounded-xl bg-white/5 text-rose-400 hover:bg-white/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
