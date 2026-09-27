import React from 'react';
import { CloudRain, Wind, Gauge, Compass, Info } from 'lucide-react';

interface RainWindRadarCardProps {
  data: {
    rain_probability: number;
    rainfall_24h: number;
    wind_speed: number;
    wind_direction: string;
    pressure: number;
    humidity: number;
  };
  onWhyThisCard: () => void;
}

export const RainWindRadarCard: React.FC<RainWindRadarCardProps> = ({ data, onWhyThisCard }) => {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Precipitation & Wind Diagnostics</h3>
            <span className="text-[11px] text-slate-400">Ground telemetry & atmospheric dynamics</span>
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

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <CloudRain className="w-5 h-5 text-sky-500 mx-auto" />
          <div className="text-slate-500 mt-1">Rain Probability</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">{data.rain_probability}%</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Wind className="w-5 h-5 text-teal-500 mx-auto" />
          <div className="text-slate-500 mt-1">Wind Velocity</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">{data.wind_speed} km/h</div>
          <div className="text-[10px] text-slate-400 font-semibold">{data.wind_direction} Vector</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Gauge className="w-5 h-5 text-indigo-500 mx-auto" />
          <div className="text-slate-500 mt-1">Barometer (MSLP)</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">{data.pressure} hPa</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="text-slate-500 mt-1">24h Observed Rain</div>
          <div className="text-lg font-extrabold text-slate-900 mt-0.5">{data.rainfall_24h} mm</div>
          <div className="text-[10px] text-slate-400 font-semibold">Gauge Total</div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>IMD surface rain-gauge and anemometer sensor observations.</span>
        <span className="font-semibold text-sky-600">Telemetry Stream</span>
      </div>
    </div>
  );
};
