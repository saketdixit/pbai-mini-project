import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Award, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import BrewingGuide from '../components/products/BrewingGuide';
import InquiryModal from '../components/products/InquiryModal';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Unable to locate harvest lot.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-[#E4DDD3] rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-[450px] bg-[#E4DDD3] rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-[#E4DDD3] rounded" />
              <div className="h-4 w-1/2 bg-[#E4DDD3] rounded" />
              <div className="h-24 bg-[#E4DDD3] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#183526]">Harvest Not Found</h2>
        <p className="text-sm text-[#5C5751] mt-2 mb-6">
          The requested tea lot could not be located in our active reserve archive.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#183526] text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center text-xs font-semibold text-[#5C5751] hover:text-[#183526] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Reserve Catalog</span>
          </Link>
        </div>

        {/* Main Product Showcase Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="relative rounded-3xl overflow-hidden border border-[#E4DDD3] bg-[#F3EFEA] shadow-xl aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#183526] text-[#FAF8F5] rounded-full shadow">
                  {product.category}
                </span>
                {product.is_featured && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-[#183526] rounded-full shadow flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Signature Reserve
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Information Architecture & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#A9713C] uppercase tracking-widest mb-1.5">
                <MapPin className="w-4 h-4 text-[#A9713C]" />
                <span>{product.origin}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#183526] tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Short Narrative Lead */}
            <p className="text-base text-[#5C5751] font-light leading-relaxed">
              {product.short_description}
            </p>

            {/* Flavor Notes Visualizer */}
            {product.flavor_notes && product.flavor_notes.length > 0 && (
              <div className="p-4 rounded-xl bg-[#F3EFEA] border border-[#E4DDD3]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#183526] block mb-2">
                  Tasting Profile & Notes
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.flavor_notes.map((note, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-semibold bg-white text-[#183526] rounded-full border border-[#E4DDD3] shadow-sm"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botanical Specification Matrix Table */}
            <div className="border border-[#E4DDD3] rounded-xl overflow-hidden bg-white">
              <div className="px-4 py-3 bg-[#183526] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider">
                Harvest Lot Specifications
              </div>
              <dl className="divide-y divide-[#E4DDD3] text-xs">
                <div className="px-4 py-3 grid grid-cols-3">
                  <dt className="text-[#5C5751] font-medium">Terroir Origin</dt>
                  <dd className="col-span-2 font-semibold text-[#183526]">{product.origin}</dd>
                </div>
                {product.flush && (
                  <div className="px-4 py-3 grid grid-cols-3 bg-[#FAF8F5]/60">
                    <dt className="text-[#5C5751] font-medium">Harvest Flush</dt>
                    <dd className="col-span-2 font-semibold text-[#183526]">{product.flush}</dd>
                  </div>
                )}
                {product.grade && (
                  <div className="px-4 py-3 grid grid-cols-3">
                    <dt className="text-[#5C5751] font-medium">Plucking Grade</dt>
                    <dd className="col-span-2 font-semibold text-[#183526]">{product.grade}</dd>
                  </div>
                )}
                <div className="px-4 py-3 grid grid-cols-3 bg-[#FAF8F5]/60">
                  <dt className="text-[#5C5751] font-medium">Lot Availability</dt>
                  <dd className="col-span-2 font-semibold text-[#3E6B52] flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {product.is_available ? 'Available for Sampling & Allocation' : 'Allocated / Reserved'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5 mr-2 text-[#D4AF37]" />
                Request 50g Sample Kit / Quote
              </button>
            </div>
          </div>
        </div>

        {/* Narrative Description & Sommelier Brewing Guide */}
        <div className="space-y-12 mb-16">
          <div className="bg-[#FAF8F5] border border-[#E4DDD3] rounded-2xl p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-[#183526] mb-4">
              Harvest Story & Terroir Notes
            </h2>
            <div className="text-sm sm:text-base text-[#5C5751] font-light leading-relaxed whitespace-pre-line space-y-4">
              {product.description}
            </div>
          </div>

          {/* Brewing Guide Matrix */}
          <BrewingGuide guide={product.brewing_guide} />
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        product={product}
      />
    </div>
  );
}
