import React from 'react';
import { Activity, Clock, ThumbsUp, AlertCircle, Info, Wind, Droplets, Sun } from 'lucide-react';

interface RunningScoreCardProps {
  data: {
    score: number;
    status: string;
    color: string;
    best_time: string;
    avoid_time: string;
    metrics: {
      temperature: string;
      humidity: string;
      wind: string;
      uv_index: number;
      rain_chance: string;
    };
    disclaimer: string;
  };
  onWhyThisCard: () => void;
}

export const RunningScoreCard: React.FC<RunningScoreCardProps> = ({ data, onWhyThisCard }) => {
  const getBadgeColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  const getScoreCircleColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 stroke-emerald-600';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Outdoor Activity & Running Score</h3>
            <span className="text-[11px] text-slate-400">Tailored for outdoor fitness</span>
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

      {/* Main Score Layout */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Circular Score Gauge */}
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getScoreCircleColor(data.score)}
                strokeDasharray={`${data.score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold text-slate-900">{data.score}</span>
              <span className="text-[9px] font-semibold text-slate-400 -mt-1">/ 100</span>
            </div>
          </div>

          <div>
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(data.score)}`}>
              {data.status}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Based on Temp {data.metrics.temperature}, UV {data.metrics.uv_index}, Wind {data.metrics.wind}
            </div>
          </div>
        </div>

        {/* Windows: Best Time & Avoid Time */}
        <div className="flex flex-col space-y-2 text-xs">
          <div className="flex items-center space-x-2 bg-emerald-50/70 border border-emerald-100 p-2 rounded-xl text-emerald-900">
            <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Optimal Window:</span> {data.best_time}
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-amber-50/70 border border-amber-100 p-2 rounded-xl text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Caution Window:</span> {data.avoid_time}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory IMD Transparency Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>{data.disclaimer}</span>
        <span className="font-medium text-slate-500">Fitness Profile</span>
      </div>
    </div>
  );
};
