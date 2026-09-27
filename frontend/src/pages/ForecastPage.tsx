import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CloudSun, Sun, CloudRain, Cloud, CloudLightning, Calendar, Clock, Droplets, Wind } from 'lucide-react';
import { LocationDetails, ForecastDay, ForecastHour } from '../types';
import { api } from '../services/api';

interface ForecastPageProps {
  location: LocationDetails;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({ location }) => {
  const [daily, setDaily] = useState<ForecastDay[]>([]);
  const [hourly, setHourly] = useState<ForecastHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [d, h] = await Promise.all([
          api.getForecast(location.latitude, location.longitude),
          api.getHourlyForecast(location.latitude, location.longitude)
        ]);
        setDaily(d);
        setHourly(h);
      } catch (e) {
        console.error("Forecast fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.latitude, location.longitude]);

  const getWeatherIcon = (code: string) => {
    switch (code) {
      case 'thunderstorm':
        return <CloudLightning className="w-6 h-6 text-amber-500" />;
      case 'rain_light':
      case 'rain':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-slate-400" />;
      case 'partly_cloudy':
        return <CloudSun className="w-6 h-6 text-amber-400" />;
      case 'sunny':
      default:
        return <Sun className="w-6 h-6 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        <div className="h-64 rounded-3xl bg-slate-200" />
        <div className="h-64 rounded-3xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-imd-blue" />
          <span>Weather Forecast • {location.name}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official 7-day meteorological outlook and 24-hour diurnal trend
        </p>
      </div>

      {/* 24-Hour Diurnal Temperature & Rain Trend Chart */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-imd-blue" />
            <span>24-Hour Temperature & Rain Trend</span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span>Temp (°C)</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-300 inline-block" />
              <span>Rain Prob (%)</span>
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a56db" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#1a56db" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ForecastHour;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                        <div className="font-bold">{data.time} - {data.condition}</div>
                        <div>Temperature: <span className="text-amber-400 font-bold">{data.temperature}°C</span></div>
                        <div>Feels like: {data.feels_like}°C</div>
                        <div>Rain Chance: <span className="text-sky-300 font-bold">{data.rain_probability}%</span></div>
                        <div>Wind: {data.wind_speed} km/h</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="temperature" stroke="#1a56db" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Forecast Horizon Cards */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-4">
          7-Day Extended Forecast Horizon
        </h2>

        <div className="space-y-3">
          {daily.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors text-xs"
            >
              {/* Day name & date */}
              <div className="w-24">
                <div className="font-bold text-slate-900 text-sm">{d.day_name}</div>
                <div className="text-[11px] text-slate-400">{d.date}</div>
              </div>

              {/* Icon & condition */}
              <div className="flex items-center space-x-2.5 flex-1 max-w-xs">
                {getWeatherIcon(d.condition_code)}
                <div>
                  <div className="font-semibold text-slate-800">{d.condition}</div>
                  <div className="text-[11px] text-slate-500 truncate hidden sm:block">{d.summary}</div>
                </div>
              </div>

              {/* Rain prob */}
              <div className="flex items-center space-x-1 text-sky-700 font-semibold w-16">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>{d.rain_probability}%</span>
              </div>

              {/* High / Low temps */}
              <div className="text-right w-20">
                <span className="font-extrabold text-slate-900 text-sm">{Math.round(d.temp_max)}°</span>
                <span className="text-slate-400 text-xs ml-1.5">{Math.round(d.temp_min)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
