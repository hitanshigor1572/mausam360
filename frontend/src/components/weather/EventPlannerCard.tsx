import React from 'react';
import { Calendar, PartyPopper, ThumbsUp, Info, ArrowRight } from 'lucide-react';

interface EventPlannerCardProps {
  data: {
    comfort_score: number;
    verdict: string;
    next_weekend_outlook: string;
  };
  onWhyThisCard: () => void;
  onNavigateToEvents?: () => void;
}

export const EventPlannerCard: React.FC<EventPlannerCardProps> = ({
  data,
  onWhyThisCard,
  onNavigateToEvents
}) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Outdoor Event Suitability Score</h3>
            <span className="text-[11px] text-slate-400">Atmospheric comfort index for open-air functions</span>
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

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center text-indigo-700 font-extrabold shrink-0">
            <span className="text-2xl leading-none">{data.comfort_score}</span>
            <span className="text-[9px] text-indigo-500 uppercase font-semibold">/ 100</span>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-800">Suitability Index</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{data.verdict}</div>
            <div className="text-xs text-slate-500 mt-0.5">Calculated from temperature, humidity, rain & wind vectors.</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
          <div className="font-semibold text-slate-900 flex items-center space-x-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Weekend Horizon:</span>
          </div>
          <div>{data.next_weekend_outlook}</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>App-generated event comfort score based on multi-parameter tolerance model.</span>
        {onNavigateToEvents && (
          <button onClick={onNavigateToEvents} className="text-indigo-600 font-bold hover:underline flex items-center space-x-1">
            <span>Planner Tool</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
