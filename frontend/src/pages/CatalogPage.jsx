import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, Sparkles, X } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import InquiryModal from '../components/products/InquiryModal';

const CATEGORIES = [
  'All',
  'Black Tea',
  'Green Tea',
  'White Tea',
  'Oolong',
  'Herbal / Tisane'
];

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await api.getProducts({
          category: activeCategory !== 'All' ? activeCategory : undefined,
          q: searchQuery.trim() || undefined,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load catalog products', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleInquire = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#A9713C] block mb-2">
            The Botanical Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#183526] tracking-tight">
            Reserve Harvest Catalog
          </h1>
          <p className="text-sm sm:text-base text-[#5C5751] mt-3 font-light leading-relaxed">
            Browse our curated micro-lots of single-estate orthodox teas. Each selection is harvested in limited quantities according to biodynamic agricultural calendars.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-[#F3EFEA] border border-[#E4DDD3] rounded-2xl p-4 sm:p-5 mb-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                    activeCategory === cat
                      ? 'bg-[#183526] text-[#FAF8F5] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#5C5751] hover:text-[#183526] border border-[#E4DDD3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-[#5C5751] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by estate, flavor note, origin..."
                className="w-full pl-10 pr-9 py-2 rounded-full border border-[#E4DDD3] bg-[#FAF8F5] text-xs focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5751] hover:text-[#183526]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#5C5751] mb-6 px-1">
          <span>
            Showing <strong className="text-[#183526]">{products.length}</strong> harvest selections {activeCategory !== 'All' && `in ${activeCategory}`}
          </span>
          {(activeCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                handleCategorySelect('All');
                setSearchQuery('');
              }}
              className="text-[#A9713C] hover:underline flex items-center font-medium"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-xl bg-[#E4DDD3]/40 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-[#F3EFEA]/50 border border-dashed border-[#E4DDD3] rounded-2xl">
            <Sparkles className="w-10 h-10 text-[#C9BEAF] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#183526]">No Harvests Match Your Search</h3>
            <p className="text-xs text-[#5C5751] mt-1 max-w-sm mx-auto">
              We couldn't find any tea lots matching "{searchQuery}". Try selecting another category or resetting filters.
            </p>
            <button
              onClick={() => {
                handleCategorySelect('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#FAF8F5] bg-[#183526] rounded-full"
            >
              View Full Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInquire={handleInquire}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
