import React from 'react';
import { Waves, Wind, Sun, AlertCircle, Info, ShieldCheck, Compass } from 'lucide-react';

interface MarineCardProps {
  data: {
    is_coastal: boolean;
    wave_height_m: string;
    tide_schedule: string;
    sea_condition: string;
    uv_radiation: string;
    disclaimer: string;
  };
  onWhyThisCard: () => void;
}

export const MarineCard: React.FC<MarineCardProps> = ({ data, onWhyThisCard }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Coastal & Marine Conditions</h3>
            <span className="text-[11px] text-slate-400">Sea state, wave dynamics & tide bulletin</span>
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

      {/* Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Wave Height */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Significant Wave Height</div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{data.wave_height_m}</span>
            <span className="text-xs text-slate-500">nearshore swell</span>
          </div>
          <div className="mt-1 text-xs text-slate-600 font-medium">
            {data.sea_condition}
          </div>
        </div>

        {/* Tide Schedule */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Astronomical Tide Cycle</div>
          <div className="mt-2 text-sm font-bold text-slate-800">
            {data.tide_schedule}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {data.uv_radiation}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{data.disclaimer}</span>
        <span className="font-semibold text-cyan-700">Marine Profile</span>
      </div>
    </div>
  );
};
