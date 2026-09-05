import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

export default function ProductCard({ product, onInquire }) {
  return (
    <div className="group bg-[#FAF8F5] border border-[#E4DDD3] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3EFEA]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#183526]/90 text-[#FAF8F5] backdrop-blur-sm rounded-full shadow-sm">
            {product.category}
          </span>
          {product.is_featured && (
            <span className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase bg-[#D4AF37] text-[#183526] rounded-full shadow-sm flex items-center">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              Reserve
            </span>
          )}
        </div>

        {/* Flush / Harvest Tag */}
        {product.flush && (
          <div className="absolute bottom-3 right-3 px-2 py-1 text-[10px] font-medium tracking-wide bg-[#FAF8F5]/90 text-[#5C5751] backdrop-blur-sm rounded border border-[#E4DDD3]">
            {product.flush}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Origin & Elevation */}
        <div className="flex items-center text-xs font-medium text-[#A9713C] mb-1.5">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="truncate">{product.origin}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-[#183526] group-hover:text-[#A9713C] transition-colors line-clamp-1 mb-2">
          <Link to={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#5C5751] line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.short_description}
        </p>

        {/* Flavor Notes Tags */}
        {product.flavor_notes && product.flavor_notes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.flavor_notes.slice(0, 3).map((note, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-[10px] font-medium bg-[#F3EFEA] text-[#183526] rounded-md border border-[#E4DDD3]/60"
              >
                {note}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-[#E4DDD3]/60 flex items-center justify-between">
          <Link
            to={`/products/${product.slug}`}
            className="text-xs font-semibold text-[#183526] group-hover:text-[#A9713C] flex items-center transition-colors"
          >
            <span>Botanical Specs</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onInquire ? onInquire(product) : null;
            }}
            className="text-[11px] font-medium uppercase tracking-wider text-[#A9713C] hover:text-[#183526] bg-[#E4DDD3]/40 hover:bg-[#E4DDD3] px-2.5 py-1 rounded transition-colors"
          >
            Inquire Lot
          </button>
        </div>
      </div>
    </div>
  );
}
