import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Clock, ArrowUpRight, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#183526] text-[#FAF8F5] pt-16 pb-12 border-t border-[#2A4A38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2A4A38]">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#183526] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#A9713C]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#FAF8F5]">
                AURA ARTISANAL
              </span>
            </div>
            <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
              Curators and exporters of single-estate, orthodox whole-leaf teas from high-altitude Himalayan and Nilgiri terroirs. Preserving traditional biodynamic harvesting for international discerning palates.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#D4AF37] font-medium tracking-wide">
              <span>EST. 2026</span>
              <span>•</span>
              <span>KURSEONG & NILGIRI</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors flex items-center">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors flex items-center">
                  Reserve Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors flex items-center">
                  Heritage & Philosophy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors flex items-center">
                  Wholesale & Procurement
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Tea Categories */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/catalog?category=Black%20Tea" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors">
                  First Flush & Orthodox Black
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=White%20Tea" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors">
                  Silver Needle Imperial White
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Green%20Tea" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors">
                  High-Elevation Steamed Green
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Oolong" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors">
                  Moonlight Semi-Oxidized Oolong
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Herbal%20/%20Tisane" className="text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors">
                  Alpine Rest Mountain Tisanes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Estate & Export Inquiries */}
          <div className="space-y-3 text-sm">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] mb-4">
              Estate & Export Office
            </h3>
            <p className="flex items-start text-[#FAF8F5]/80">
              <MapPin className="w-4 h-4 mr-2.5 text-[#A9713C] shrink-0 mt-0.5" />
              <span>Aura Tea Pavilion, Mountain Vista Road, Kurseong, Darjeeling 734203</span>
            </p>
            <p className="flex items-center text-[#FAF8F5]/80">
              <Mail className="w-4 h-4 mr-2.5 text-[#A9713C] shrink-0" />
              <span>inquiries@aurateas.example.com</span>
            </p>
            <p className="flex items-center text-[#FAF8F5]/80">
              <Phone className="w-4 h-4 mr-2.5 text-[#A9713C] shrink-0" />
              <span>+91-9876543210</span>
            </p>
            <p className="flex items-center text-[#FAF8F5]/80">
              <Clock className="w-4 h-4 mr-2.5 text-[#A9713C] shrink-0" />
              <span>Mon – Sat: 09:00 AM – 07:00 PM IST</span>
            </p>
          </div>
        </div>

        {/* Sub-footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF8F5]/60 gap-4">
          <p>© {new Date().getFullYear()} Aura Artisanal Teas Pvt. Ltd. All rights reserved. Single-Estate Terroir Reserve.</p>
          <div className="flex items-center space-x-6">
            <Link to="/contact" className="hover:text-[#FAF8F5] transition-colors">
              Wholesale Inquiries
            </Link>
            <Link to="/admin/login" className="hover:text-[#FAF8F5] flex items-center transition-colors">
              <Lock className="w-3 h-3 mr-1 text-[#D4AF37]" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
