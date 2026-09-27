import React from 'react';
import { HeartPulse, Wind, Sun, AlertCircle, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AQICardProps {
  data: {
    aqi: number;
    aqi_category: string;
    uv_index: number;
    humidity: number;
    primary_advisory: string;
    action_items: string[];
    pollen_status: string;
    disclaimer: string;
  };
  onWhyThisCard: () => void;
}

export const AQICard: React.FC<AQICardProps> = ({ data, onWhyThisCard }) => {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (aqi <= 100) return { bg: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-50 text-green-700 border-green-200' };
    if (aqi <= 200) return { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (aqi <= 300) return { bg: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-50 text-orange-700 border-orange-200' };
    return { bg: 'bg-rose-600', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const aqiColors = getAQIColor(data.aqi);

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Air Quality & UV Health Insights</h3>
            <span className="text-[11px] text-slate-400">Environmental wellness guidance</span>
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

      {/* Grid: AQI meter & UV Index */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* AQI Panel */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">National AQI (CPCB)</div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${aqiColors.badge}`}>
              {data.aqi_category}
            </span>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{data.aqi}</span>
            <span className="text-xs text-slate-400 font-medium">Index</span>
          </div>

          {/* AQI spectrum line */}
          <div className="mt-2 w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
            <div className="w-1/5 bg-emerald-500" title="Good (0-50)" />
            <div className="w-1/5 bg-green-500" title="Satisfactory (51-100)" />
            <div className="w-1/5 bg-amber-500" title="Moderate (101-200)" />
            <div className="w-1/5 bg-orange-500" title="Poor (201-300)" />
            <div className="w-1/5 bg-rose-600" title="Very Poor / Severe (300+)" />
          </div>
        </div>

        {/* UV Index Panel */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ultraviolet (UV) Exposure</div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {data.uv_index > 7 ? 'Very High' : 'Moderate'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{data.uv_index}</span>
            <span className="text-xs text-slate-400 font-medium">UVI (Peak noon)</span>
          </div>

          <div className="mt-2 text-xs text-slate-600">
            {data.uv_index >= 6 ? 'Sun protection (SPF 30+, shades) advised.' : 'Safe ambient radiation.'}
          </div>
        </div>
      </div>

      {/* Health action points */}
      <div className="mt-4 space-y-2">
        {data.action_items.map((item, idx) => (
          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
            <CheckCircle2 className="w-4 h-4 text-imd-blue shrink-0 mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Pollen Notice & Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
        <span>{data.pollen_status}</span>
        <span className="italic">{data.disclaimer}</span>
      </div>
    </div>
  );
};
