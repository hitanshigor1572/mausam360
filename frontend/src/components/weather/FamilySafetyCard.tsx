import React from 'react';
import { Users, Clock, CloudRain, Sun, Info, ShieldCheck } from 'lucide-react';

interface FamilySafetyCardProps {
  data: {
    school_commute: {
      time: string;
      rain_chance: string;
      temp: string;
      advice: string;
    };
    afternoon_return: {
      time: string;
      uv: number;
      temp: string;
      advice: string;
    };
  };
  onWhyThisCard: () => void;
}

export const FamilySafetyCard: React.FC<FamilySafetyCardProps> = ({ data, onWhyThisCard }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Family & School Routine Weather</h3>
            <span className="text-[11px] text-slate-400">Tailored for parents and household commutes</span>
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

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Morning School Commute */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-imd-blue" />
              <span>Morning School Commute</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">{data.school_commute.time}</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{data.school_commute.temp}</span>
            <span className="text-xs text-slate-500">| Rain: {data.school_commute.rain_chance}</span>
          </div>
          <p className="mt-2 text-xs text-slate-700 font-medium">
            {data.school_commute.advice}
          </p>
        </div>

        {/* Afternoon Return */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Afternoon Return Hours</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">{data.afternoon_return.time}</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{data.afternoon_return.temp}</span>
            <span className="text-xs text-slate-500">| UV Index: {data.afternoon_return.uv}</span>
          </div>
          <p className="mt-2 text-xs text-slate-700 font-medium">
            {data.afternoon_return.advice}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Routine protection advice designed for family safety.</span>
        <span className="font-semibold text-purple-600">Family Profile</span>
      </div>
    </div>
  );
};
