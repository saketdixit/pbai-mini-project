import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, ShieldCheck, Sun, Mountain, ArrowRight, HeartHandshake } from 'lucide-react';
import { api } from '../services/api';

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await api.getAboutContent();
        setContent(data);
      } catch (err) {
        console.error('Failed to load About content', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-[#E4DDD3] mx-auto rounded" />
          <div className="h-4 w-96 bg-[#E4DDD3] mx-auto rounded" />
          <div className="h-64 bg-[#E4DDD3] rounded-2xl" />
        </div>
      </div>
    );
  }

  const pillars = content?.values?.pillars || [
    {
      title: 'Single-Estate Terroir',
      description: 'Never blended with commercial filler leaves. Every batch represents an authentic single harvest lot.',
    },
    {
      title: 'Ethical Stewardship',
      description: '100% fair grower compensation, bio-organic cultivation, and zero chemical pesticide runoff.',
    },
    {
      title: 'Small-Batch Orthodox Craft',
      description: 'Slow solar-assisted withering, hand-rolling, and micro-lot roasting by generational tea masters.',
    },
    {
      title: 'Direct B2B Procurement',
      description: 'Supplying bespoke tea programs to specialty cafes, luxury hospitality suites, and connoisseur importers worldwide.',
    },
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#A9713C] block">
            Our Terroir Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#183526] tracking-tight">
            {content?.title || 'Our Heritage & Terroir Philosophy'}
          </h1>
          <p className="text-lg text-[#5C5751] font-light italic">
            "{content?.headline || 'From the Mist-Veiled Slopes to the Refined Cup'}"
          </p>
        </div>

        {/* Narrative Section */}
        <div className="bg-white border border-[#E4DDD3] rounded-3xl p-8 sm:p-12 shadow-sm mb-16">
          <div className="prose prose-stone max-w-none text-[#5C5751] leading-relaxed text-sm sm:text-base font-light space-y-6">
            {content?.story.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-serif text-2xl font-bold text-[#183526] pt-4 first:pt-0">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>
        </div>

        {/* Sourcing & Quality Pillars */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#A9713C] block mb-1">
              Foundational Standards
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#183526]">
              How We Guard Leaf Purity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F3EFEA] border border-[#E4DDD3] space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#183526] text-[#D4AF37] flex items-center justify-center font-serif text-sm font-bold">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#183526]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5751] leading-relaxed pl-11">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="rounded-3xl bg-[#183526] text-[#FAF8F5] p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold text-white">
            Experience Our Harvest Selections
          </h2>
          <p className="text-sm text-[#FAF8F5]/80 max-w-xl mx-auto font-light">
            We invite tea directors, culinary curators, and retail brand founders to sample our seasonal single-estate lots.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D4AF37] text-[#183526] hover:bg-[#E5C358] transition-all shadow"
            >
              Browse Catalog
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] border border-white/40 hover:bg-white/10 transition-all"
            >
              Request Sommelier Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
