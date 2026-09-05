import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Reserve Catalog', path: '/catalog' },
    { name: 'Heritage & Terroir', path: '/about' },
    { name: 'Procurement & Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E4DDD3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-full bg-[#183526] text-[#FAF8F5] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <Leaf className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#183526] block leading-none">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-[#A9713C] uppercase font-medium">
                Artisanal Teas
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#183526] ${
                  isActive(link.path)
                    ? 'text-[#183526] border-b-2 border-[#183526] pb-1'
                    : 'text-[#5C5751]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="flex items-center text-xs font-semibold text-[#183526] bg-[#E4DDD3]/60 px-3 py-1.5 rounded-full hover:bg-[#E4DDD3] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 mr-1 text-[#A9713C]" />
                Admin CMS
              </Link>
            )}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] rounded-full transition-all shadow-sm hover:shadow group"
            >
              <span>Inquire / Quote</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform text-[#D4AF37]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#183526] hover:bg-[#E4DDD3]/50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E4DDD3] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#E4DDD3]/70 text-[#183526] font-semibold'
                  : 'text-[#5C5751] hover:bg-[#E4DDD3]/30'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-base font-semibold text-[#183526] bg-[#E4DDD3]/60"
            >
              <Shield className="w-4 h-4 mr-2 text-[#A9713C]" />
              Admin CMS Dashboard
            </Link>
          )}

          <div className="pt-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-semibold tracking-wider uppercase text-[#FAF8F5] bg-[#183526] rounded-full shadow"
            >
              <span>Request Wholesale Quote</span>
              <ArrowRight className="w-4 h-4 ml-2 text-[#D4AF37]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
