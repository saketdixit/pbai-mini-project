import React from 'react';
import { Thermometer, Timer, Scale, RotateCcw } from 'lucide-react';

export default function BrewingGuide({ guide }) {
  if (!guide) return null;

  const metrics = [
    {
      label: 'Water Temperature',
      value: guide.temp || '85°C / 185°F',
      sub: 'Off boiling to preserve floral top notes',
      icon: Thermometer,
      color: 'text-[#A9713C]',
      bg: 'bg-[#C58F58]/10'
    },
    {
      label: 'Steeping Duration',
      value: guide.steep_time || '3 mins',
      sub: 'Avoid over-extraction of tannins',
      icon: Timer,
      color: 'text-[#183526]',
      bg: 'bg-[#183526]/10'
    },
    {
      label: 'Leaf-to-Water Ratio',
      value: guide.ratio || '2.5g per 200ml',
      sub: 'One rounded teaspoon of whole leaf',
      icon: Scale,
      color: 'text-[#D4AF37]',
      bg: 'bg-[#D4AF37]/15'
    },
    {
      label: 'Resteep Potential',
      value: `${guide.infusions || 3} Infusions`,
      sub: 'Unfurls new aromatic dimensions',
      icon: RotateCcw,
      color: 'text-[#3E6B52]',
      bg: 'bg-[#3E6B52]/10'
    },
  ];

  return (
    <div className="bg-[#FAF8F5] border border-[#E4DDD3] rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E4DDD3]">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#183526]">
            Sommelier Brewing Matrix
          </h3>
          <p className="text-xs text-[#5C5751] mt-0.5">
            Optimized brewing parameters to unlock this lot's authentic aroma and sweetness.
          </p>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-[#A9713C] bg-[#E4DDD3]/50 px-3 py-1 rounded-full">
          Orthodox Method
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F3EFEA]/80 border border-[#E4DDD3]/80 flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#5C5751] block">
                    {item.label}
                  </span>
                  <span className="text-base font-bold text-[#183526]">
                    {item.value}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#5C5751]/80 italic">
                {item.sub}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
