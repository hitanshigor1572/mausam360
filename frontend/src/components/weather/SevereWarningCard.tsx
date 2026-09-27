import React from 'react';
import { ShieldAlert, AlertTriangle, Clock, MapPin, Info } from 'lucide-react';
import { WeatherWarning } from '../../types';

interface SevereWarningCardProps {
  warning: WeatherWarning;
  isCritical?: boolean;
  onWhyThisCard: () => void;
}

export const SevereWarningCard: React.FC<SevereWarningCardProps> = ({
  warning,
  isCritical = true,
  onWhyThisCard
}) => {
  const isRed = warning.severity === 'critical';

  return (
    <div className={`rounded-2xl p-5 sm:p-6 text-white shadow-xl transition-all border ${
      isRed 
        ? 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800 border-red-500/50 shadow-rose-900/20' 
        : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 border-amber-400/50 shadow-amber-900/20'
    }`}>
      {/* Top row: Priority 1 badge & Why this card button */}
      <div className="flex items-center justify-between pb-3 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white flex items-center space-x-1 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isRed ? 'PRIORITY 1: CRITICAL WEATHER OVERRIDE' : 'ACTIVE WEATHER WARNING'}</span>
          </span>
        </div>

        <button
          onClick={onWhyThisCard}
          className="flex items-center space-x-1 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
          title="Explain personalization override"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="font-medium text-[11px]">Why this card?</span>
        </button>
      </div>

      {/* Main warning headline */}
      <div className="mt-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`w-7 h-7 shrink-0 ${isRed ? 'text-amber-300 animate-bounce' : 'text-yellow-200'}`} />
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
              {warning.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1 leading-relaxed">
              {warning.description}
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Citizen Advisory Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-black/20 border border-white/15">
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200 mb-1">
          Recommended Safety Action:
        </div>
        <div className="text-xs sm:text-sm font-semibold text-white">
          {warning.action_advisory}
        </div>
      </div>

      {/* Bottom metadata */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/80 pt-2 border-t border-white/10">
        <div className="flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-white/60" />
          <span>Validity: {warning.start_time} — {warning.end_time}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-white/60" />
          <span>Sector: {warning.affected_area}</span>
        </div>
      </div>
    </div>
  );
};
