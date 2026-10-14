import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, FileDown, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  resumeUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  resumeUrl = '/assets/bhanu_resume.pdf'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, signOutUser } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md shadow-lg shadow-slate-200/30 dark:shadow-black/30 border-b border-slate-200/80 dark:border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              BB
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Bhausri Bezawada
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Engineering & Marketing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHomePage ? link.href : `/${link.href}`}
                className="px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-md hover:scale-105 active:scale-95"
              aria-label={`Switch to ${theme === 'light' ? 'Dark Mode (Obsidian)' : 'Blue Mode (Royal Navy)'}`}
              title={`Switch to ${theme === 'light' ? 'Dark Mode (Obsidian Black)' : 'Blue Mode (Midnight Navy)'}`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Resume Download CTA */}
            <a
              href={resumeUrl}
              download="Bhanu_Bezawada_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline" icon={<FileDown className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}>
                Resume
              </Button>
            </a>

            {/* Admin or Login Link */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button size="sm" variant="primary" icon={<Shield className="w-3.5 h-3.5" />}>
                      Admin
                    </Button>
                  </Link>
                )}
                <button
                  onClick={signOutUser}
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  title="Admin Portal Login"
                  aria-label="Admin Portal Login"
                >
                  <Shield className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer"
              aria-label={`Switch to ${theme === 'light' ? 'Dark Mode (Obsidian)' : 'Blue Mode (Royal Navy)'}`}
              title={`Switch to ${theme === 'light' ? 'Dark Mode (Obsidian)' : 'Blue Mode (Royal Navy)'}`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="sm:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800/80 px-4 pt-3 pb-6 animate-fadeIn shadow-xl">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={isHomePage ? link.href : `/${link.href}`}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5">
              <a
                href={resumeUrl}
                download="Bhanu_Bezawada_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <Button className="w-full" size="md" variant="outline" icon={<FileDown className="w-4 h-4" />}>
                  Download Resume
                </Button>
              </a>

              {user ? (
                <div className="flex gap-2">
                  {isAdmin && (
                    <Link to="/admin" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" size="md" variant="primary" icon={<Shield className="w-4 h-4" />}>
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button size="md" variant="ghost" onClick={signOutUser} icon={<LogOut className="w-4 h-4 text-rose-500" />}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" size="md" variant="ghost" icon={<Shield className="w-4 h-4" />}>
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
