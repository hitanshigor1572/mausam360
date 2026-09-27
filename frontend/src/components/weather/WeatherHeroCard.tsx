import React from 'react';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, Wind, Droplets, Eye, Compass, ArrowUp, ArrowDown } from 'lucide-react';
import { CurrentWeather, LocationDetails } from '../../types';

interface WeatherHeroCardProps {
  weather: CurrentWeather;
  location: LocationDetails;
  timeContext?: string;
  userName?: string;
}

export const WeatherHeroCard: React.FC<WeatherHeroCardProps> = ({
  weather,
  location,
  timeContext,
  userName = "Citizen"
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getWeatherIcon = (code: string) => {
    switch (code) {
      case 'thunderstorm':
        return <CloudLightning className="w-16 h-16 text-amber-400 animate-pulse" />;
      case 'rain_light':
      case 'rain':
        return <CloudRain className="w-16 h-16 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="w-16 h-16 text-slate-300" />;
      case 'partly_cloudy':
        return <CloudSun className="w-16 h-16 text-amber-300" />;
      case 'sunny':
      default:
        return <Sun className="w-16 h-16 text-amber-400 animate-spin-slow" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-imd-navy via-[#103b68] to-imd-navy text-white p-6 sm:p-8 shadow-xl border border-blue-900/40">
      {/* Subtle background meteorological contours */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left side: Greeting, location, temperature & condition */}
        <div>
          <div className="text-sm font-medium text-sky-200 tracking-wide">
            {getGreeting()}, {userName} 👋
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            {location.name}, {location.district ? `${location.district}, ` : ''}{location.state}
          </h1>

          <div className="flex items-baseline space-x-3 mt-4">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white">
              {Math.round(weather.temperature)}°
            </span>
            <span className="text-xl sm:text-2xl font-semibold text-sky-200">
              C
            </span>
            <div className="border-l border-white/20 pl-3">
              <div className="text-lg font-bold text-white">{weather.condition}</div>
              <div className="text-xs text-sky-200">Feels like {Math.round(weather.feels_like)}°C</div>
            </div>
          </div>
        </div>

        {/* Center / Right: Dynamic Weather Graphic and Vital Indices */}
        <div className="flex items-center space-x-6">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
            {getWeatherIcon(weather.condition_code)}
          </div>
        </div>
      </div>

      {/* Bottom Meteorological Vital Metrics Strip */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-sky-300">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sky-200/80 font-medium text-[11px]">Humidity</div>
            <div className="font-bold text-sm text-white">{weather.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-sky-300">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sky-200/80 font-medium text-[11px]">Wind</div>
            <div className="font-bold text-sm text-white">{weather.wind_speed} km/h {weather.wind_direction}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-amber-300">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sky-200/80 font-medium text-[11px]">UV Index</div>
            <div className="font-bold text-sm text-white">
              {weather.uv_index} <span className="text-[10px] font-normal text-sky-200">({weather.uv_index > 7 ? 'Very High' : (weather.uv_index > 5 ? 'High' : 'Moderate')})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-emerald-300">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sky-200/80 font-medium text-[11px]">Visibility</div>
            <div className="font-bold text-sm text-white">{weather.visibility} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};
