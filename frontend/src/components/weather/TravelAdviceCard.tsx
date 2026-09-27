import React from 'react';
import { Compass, Briefcase, Check, Info, ArrowRight, CloudRain, Sun } from 'lucide-react';

interface TravelAdviceCardProps {
  data: {
    packing_suggestions: string[];
    destination_quick_glance: Array<{
      city: string;
      temp: number;
      cond: string;
      rain: number;
    }>;
  };
  onWhyThisCard: () => void;
  onNavigateToTravel?: () => void;
}

export const TravelAdviceCard: React.FC<TravelAdviceCardProps> = ({
  data,
  onWhyThisCard,
  onNavigateToTravel
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Travel Weather & Smart Packing</h3>
            <span className="text-[11px] text-slate-400">Dynamic trip luggage and destination outlook</span>
          </div>
        </div>

        <button
          onClick={onWhyThisCard}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-imd-blue bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-full border border-slate-200/60 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Why this card?</span>
        </button>
      </div>

      {/* Smart Packing Checklist */}
      <div className="mt-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          <Briefcase className="w-3.5 h-3.5 text-sky-600" />
          <span>Smart Packing Suggestions (Forecast-Driven)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {data.packing_suggestions.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Glance at Major Destinations */}
      <div className="mt-5">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Popular Saved Destinations</span>
          {onNavigateToTravel && (
            <button 
              onClick={onNavigateToTravel}
              className="text-imd-blue hover:underline flex items-center space-x-1 text-[11px] font-bold"
            >
              <span>Manage Destinations</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {data.destination_quick_glance.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-xs font-bold text-slate-800">{d.city}</div>
              <div className="text-base font-extrabold text-imd-navy mt-0.5">{d.temp}°C</div>
              <div className="text-[10px] text-slate-500 truncate">{d.cond}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Smart packing suggestions calculated automatically from destination forecasts.</span>
        <span className="font-semibold text-sky-600">Travel Profile</span>
      </div>
    </div>
  );
};
