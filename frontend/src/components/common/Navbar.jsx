import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { label: 'Gallery', to: '/gallery' },
  { label: 'Journal', to: '/journal' },
  { label: 'Timeline', to: '/timeline' },
  { label: 'Exhibitions', to: '/exhibitions' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#141414]/95 backdrop-blur-md border-b border-[rgba(201,168,76,0.15)] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Reyarts Home"
        >
          <div className="w-8 h-8 border border-[#c9a84c] rotate-45 flex items-center justify-center transition-all duration-300 group-hover:rotate-[135deg] group-hover:bg-[#c9a84c]">
            <span className="text-[#c9a84c] text-xs font-bold -rotate-45 group-hover:text-[#1a1a1a] transition-colors">R</span>
          </div>
          <span
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-[#f5f0e8] text-xl font-semibold tracking-wider"
          >
            Reyarts
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                style={{ fontFamily: 'Inter, sans-serif' }}
                className={({ isActive }) =>
                  `text-[0.8rem] uppercase tracking-[0.15em] font-medium transition-colors duration-300 relative ${
                    isActive
                      ? 'text-[#c9a84c]'
                      : 'text-[#cccccc] hover:text-[#f5f0e8]'
                  } after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:bg-[#c9a84c] after:transition-all after:duration-300 ${
                    location.pathname === to ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center text-[#cccccc] hover:text-[#c9a84c] transition-colors"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-[0.75rem] uppercase tracking-[0.15em] text-[#c9a84c] hover:text-[#d4b568] transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/favorites"
                className="text-[#cccccc] hover:text-[#c9a84c] transition-colors"
                aria-label="My Favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <button
                onClick={logout}
                className="btn-ghost text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-xs">Sign In</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[1px] bg-[#f5f0e8] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[1px] bg-[#f5f0e8] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-[1px] bg-[#f5f0e8] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#141414]/98 backdrop-blur-md border-t border-[rgba(201,168,76,0.1)]"
          >
            <ul className="flex flex-col px-6 py-6 gap-5">
              {navLinks.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    className={({ isActive }) =>
                      `text-sm uppercase tracking-[0.15em] font-medium ${
                        isActive ? 'text-[#c9a84c]' : 'text-[#cccccc]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-4 border-t border-[rgba(201,168,76,0.1)] flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    {isAdmin && <Link to="/admin" className="text-[#c9a84c] text-sm uppercase tracking-widest">Admin Dashboard</Link>}
                    <Link to="/favorites" className="text-[#cccccc] text-sm uppercase tracking-widest">Favorites</Link>
                    <button onClick={logout} className="btn-ghost text-xs self-start">Logout</button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" className="btn-ghost text-xs">Sign In</Link>
                    <Link to="/register" className="btn-gold text-xs">Register</Link>
                  </div>
                )}
                <button onClick={toggleTheme} className="text-[#cccccc] text-sm uppercase tracking-widest text-left">
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
