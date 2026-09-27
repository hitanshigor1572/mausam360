import React from 'react';
import { Car, Clock, Eye, Wind, CloudRain, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CommuteCardProps {
  data: {
    status: string;
    severity: string;
    summary: string;
    morning_window: string;
    evening_window: string;
    visibility_km: number;
    wind_kmh: number;
    rain_risk_percent: number;
  };
  onWhyThisCard: () => void;
}

export const CommuteCard: React.FC<CommuteCardProps> = ({ data, onWhyThisCard }) => {
  const isCaution = data.severity === 'caution';

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-50 text-imd-blue">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Daily Transit & Commute Conditions</h3>
            <span className="text-[11px] text-slate-400">Roadway and rush-hour hazard assessment</span>
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

      {/* Main Status alert */}
      <div className={`mt-4 p-4 rounded-xl border ${
        isCaution 
          ? 'bg-amber-50 border-amber-200 text-amber-900' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-start space-x-3">
          {isCaution ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              {data.status}
            </div>
            <p className="text-xs mt-1 leading-relaxed font-medium">
              {data.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Rush Hour Windows */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <Clock className="w-4 h-4 text-imd-blue" />
            <span>Morning Rush ({data.morning_window})</span>
          </div>
          <div className="mt-2 text-slate-600 flex items-center justify-between">
            <span>Rain probability:</span>
            <span className="font-semibold text-slate-900">{data.rain_risk_percent}%</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <Clock className="w-4 h-4 text-imd-blue" />
            <span>Evening Rush ({data.evening_window})</span>
          </div>
          <div className="mt-2 text-slate-600 flex items-center justify-between">
            <span>Road visibility:</span>
            <span className="font-semibold text-slate-900">{data.visibility_km} km</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Commuter transit guidance calculated for active district corridors.</span>
        <span className="font-semibold text-imd-blue">Commuter Profile</span>
      </div>
    </div>
  );
};
