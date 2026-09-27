import React from 'react';
import { MapPin, RefreshCw, Bell, User, CloudSun, ShieldAlert } from 'lucide-react';
import { LocationDetails } from '../../types';

interface NavbarProps {
  location: LocationDetails;
  onOpenLocationModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  provider: string;
  hasCriticalAlert?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  location,
  onOpenLocationModal,
  onRefresh,
  isRefreshing,
  activeTab,
  onSelectTab,
  provider,
  hasCriticalAlert = false
}) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'alerts', label: 'Alerts', badge: hasCriticalAlert },
    { id: 'destinations', label: 'Travel' },
    { id: 'events', label: 'Events' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & MoES/IMD branding */}
          <div className="flex items-center space-x-3">
            {/* MoES / IMD Emblem motif */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-imd-navy to-imd-blue flex items-center justify-center text-white shadow-md shadow-blue-900/10">
              <CloudSun className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-lg text-imd-navy">MAUSAM</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-imd-blue uppercase tracking-wider">
                  2.0
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full flex items-center space-x-1 ${
                  provider === 'live' || provider === 'imd' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${provider === 'live' || provider === 'imd' ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`} />
                  <span>{provider === 'imd' ? 'IMD Live' : (provider === 'live' ? 'Live Telemetry' : 'Demo Simulation')}</span>
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Ministry of Earth Sciences (MoES) • India Meteorological Department
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-50 text-imd-blue font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Location Chip, Refresh, Profile */}
          <div className="flex items-center space-x-2">
            {/* Location selector pill */}
            <button
              onClick={onOpenLocationModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-colors border border-slate-200/70"
              title="Change location"
            >
              <MapPin className="w-3.5 h-3.5 text-imd-blue" />
              <span className="max-w-[120px] sm:max-w-[160px] truncate">
                {location.name}, {location.state}
              </span>
            </button>

            {/* Refresh button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50"
              title="Refresh live weather observation"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-imd-blue' : ''}`} />
            </button>

            {/* Profile icon */}
            <button
              onClick={() => onSelectTab('settings')}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-imd-blue border border-slate-200 transition-colors"
              title="User Persona & Preferences"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
