import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Sun, Mountain, Award, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import InquiryModal from '../components/products/InquiryModal';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProducts({ featured: true });
        setFeaturedProducts(data);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenInquiry = (product = null) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="bg-[#FAF8F5]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-[#E4DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Narrative Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E4DDD3]/70 border border-[#C9BEAF] text-[#183526] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#A9713C]" />
                <span>Single-Estate Harvest 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#183526] leading-[1.15] tracking-tight">
                Handcrafted Terroir Teas, From Mountain Mist to Cup.
              </h1>

              <p className="text-base sm:text-lg text-[#5C5751] leading-relaxed max-w-2xl font-light">
                We cultivate and export bio-organic, orthodox whole-leaf harvests directly from high-altitude Himalayan and Nilgiri estates. Preserving natural terroir and small-lot artisanal rolling for tea houses, luxury hospitality, and connoisseurs.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] transition-all shadow-md hover:shadow-lg group"
                >
                  <span>Explore Reserve Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleOpenInquiry(null)}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#183526] bg-[#FAF8F5] hover:bg-[#E4DDD3]/60 border border-[#183526] transition-all"
                >
                  Request Procurement Kit
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-[#E4DDD3] grid grid-cols-3 gap-4 text-xs font-medium text-[#5C5751]">
                <div className="flex items-center space-x-2">
                  <Mountain className="w-4 h-4 text-[#A9713C] shrink-0" />
                  <span>5,000+ ft Altitude</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Leaf className="w-4 h-4 text-[#3E6B52] shrink-0" />
                  <span>100% Bio-Organic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>FTGFOP1 Certified</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-[#183526]/10 to-[#C58F58]/15 -rotate-1 pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-[#E4DDD3] shadow-2xl bg-white aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=85"
                    alt="Artisanal loose leaf tea drying on bamboo racks"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                      Origin Spotlight
                    </span>
                    <h3 className="font-serif text-xl font-bold">
                      Makaibari Estate, Kurseong
                    </h3>
                    <p className="text-xs text-white/80 mt-1 font-light">
                      First Flush 2026 plucking underway. Muscatel grape aroma and crystal golden hue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TERROIR & HARVESTING ROOTS */}
      <section className="py-20 bg-[#F3EFEA] border-b border-[#E4DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#A9713C]">
              Terroir Archetypes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#183526]">
              Four Iconic Microclimates
            </h2>
            <p className="text-sm sm:text-base text-[#5C5751] font-light">
              Just as fine wine mirrors its soil and vintage, our whole-leaf teas capture the altitude, rainfall, and morning mist of their specific mountain origin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                region: 'Darjeeling',
                state: 'Eastern Himalayas',
                altitude: '5,000 – 6,500 ft',
                profile: 'Muscatel grape, spring wildflowers, delicate astringency.',
                teaType: 'First & Second Flush Blacks',
              },
              {
                region: 'Nilgiri',
                state: 'Western Ghats',
                altitude: '6,000 – 7,000 ft',
                profile: 'Eucalyptus frost, bright golden liquor, lingering citrus.',
                teaType: 'Winter Frost Harvests',
              },
              {
                region: 'Kangra Valley',
                state: 'Himachal Pradesh',
                altitude: '4,500 – 5,200 ft',
                profile: 'Silvery velvet tips, fresh melon, sweet mountain hay.',
                teaType: 'Imperial Silver Needle White',
              },
              {
                region: 'Assam Highlands',
                state: 'Brahmaputra Valley',
                altitude: 'Lowland Terroir',
                profile: 'Dense malt, dark chocolate, deep copper body.',
                teaType: 'Golden Tip Orthodox',
              },
            ].map((terroir, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E4DDD3] rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#A9713C] uppercase tracking-wider">
                      {terroir.altitude}
                    </span>
                    <span className="text-[10px] bg-[#E4DDD3]/60 px-2 py-0.5 rounded text-[#5C5751] font-medium">
                      {terroir.state}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#183526]">
                    {terroir.region}
                  </h3>
                  <p className="text-xs text-[#5C5751] leading-relaxed">
                    {terroir.profile}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-[#E4DDD3] text-[11px] font-semibold text-[#183526]">
                  Key Specialty: {terroir.teaType}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTION */}
      <section className="py-20 border-b border-[#E4DDD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#A9713C]">
                Seasonal Reserve
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#183526] mt-1">
                Featured Harvest Lots
              </h2>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#183526] hover:text-[#A9713C] transition-colors"
            >
              <span>View All Reserve Teas</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-xl bg-[#E4DDD3]/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onInquire={handleOpenInquiry}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. PROCUREMENT & B2B CALLOUT BANNER (Inspired by pbai.in) */}
      <section className="py-20 bg-[#183526] text-[#FAF8F5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#D4AF37]">
                Institutional & Wholesale Partnership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Supplying Premium Tea Programs for Discerning Enterprises.
              </h2>
              <p className="text-sm sm:text-base text-[#FAF8F5]/80 font-light leading-relaxed max-w-2xl">
                We provide custom loose-leaf lot selection, private-label tin packaging, Certificate of Analysis (COA) export documentation, and sommelier staff training for luxury hotels, upscale culinary venues, and boutique tea merchants.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <button
                type="button"
                onClick={() => handleOpenInquiry(null)}
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-[#183526] bg-[#D4AF37] hover:bg-[#E5C358] transition-all shadow-md"
              >
                Request 50g Sample Kit
              </button>
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] border border-[#FAF8F5]/40 hover:bg-white/10 transition-all text-center"
              >
                Book 30-Min Sommelier Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
