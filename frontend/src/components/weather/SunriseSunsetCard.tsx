import React from 'react';
import { Sunrise, Sunset, Clock, Sun, Sparkles, Info } from 'lucide-react';

interface SunriseSunsetCardProps {
  data: {
    sunrise: string;
    sunset: string;
    daylight: string;
    golden_hour: string;
  };
  onWhyThisCard: () => void;
}

export const SunriseSunsetCard: React.FC<SunriseSunsetCardProps> = ({ data, onWhyThisCard }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daylight Cycle & Golden Hour</h3>
            <span className="text-[11px] text-slate-400">Solar tracking & optical conditions</span>
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

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Sunrise className="w-5 h-5 text-amber-500 mx-auto" />
          <div className="text-[11px] text-slate-500 font-medium mt-1">Sunrise</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{data.sunrise}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Sunset className="w-5 h-5 text-orange-500 mx-auto" />
          <div className="text-[11px] text-slate-500 font-medium mt-1">Sunset</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{data.sunset}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Clock className="w-5 h-5 text-sky-500 mx-auto" />
          <div className="text-[11px] text-slate-500 font-medium mt-1">Total Daylight</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{data.daylight}</div>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
          <Sparkles className="w-5 h-5 text-amber-600 mx-auto" />
          <div className="text-[11px] text-amber-800 font-semibold mt-1">Golden Hour</div>
          <div className="text-xs font-bold text-amber-950 mt-0.5">{data.golden_hour}</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Astronomical calculations based on station latitude and longitude.</span>
        <span className="font-semibold text-amber-600">Solar Position</span>
      </div>
    </div>
  );
};
