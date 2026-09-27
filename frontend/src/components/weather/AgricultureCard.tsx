import React from 'react';
import { Sprout, Droplet, CloudRain, Wind, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface AgricultureCardProps {
  data: {
    irrigation_verdict: string;
    irrigation_reason: string;
    action_code: string;
    soil_moisture_percent: number;
    is_sensor_real: boolean;
    sensor_label: string;
    rain_forecast_48h: string;
    spray_window: string;
    frost_risk: string;
    disclaimer: string;
  };
  onWhyThisCard: () => void;
}

export const AgricultureCard: React.FC<AgricultureCardProps> = ({ data, onWhyThisCard }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Agromet Advisory & Irrigation Guidance</h3>
            <span className="text-[11px] text-slate-400">For farmers, horticulturists & gardeners</span>
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

      {/* Main Advisory Box */}
      <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Irrigation Recommendation
            </div>
            <div className="text-base font-extrabold text-emerald-950 mt-0.5">
              {data.irrigation_verdict}
            </div>
            <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
              {data.irrigation_reason}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Soil Moisture & 48h Rain Forecast */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Soil Moisture */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-500" />
              <span>Volumetric Soil Moisture</span>
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
              {data.sensor_label}
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{data.soil_moisture_percent}%</span>
            <span className="text-xs text-slate-400">capacity</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${Math.min(100, data.soil_moisture_percent)}%` }} 
            />
          </div>
        </div>

        {/* 48h Rain forecast */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
            <CloudRain className="w-3.5 h-3.5 text-sky-500" />
            <span>48-Hour Precipitation Likelihood</span>
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {data.rain_forecast_48h}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Frost Risk: {data.frost_risk}
          </div>
        </div>
      </div>

      {/* Spray window */}
      <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 flex items-center space-x-2">
        <Wind className="w-4 h-4 text-amber-600 shrink-0" />
        <span><strong>Pesticide / Spray Window:</strong> {data.spray_window}</span>
      </div>

      {/* Transparent disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>{data.disclaimer}</span>
        <span className="text-amber-700 font-semibold">Agromet Engine</span>
      </div>
    </div>
  );
};
