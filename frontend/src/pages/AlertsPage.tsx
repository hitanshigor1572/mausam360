import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Clock, MapPin, CheckCircle, Filter, FileText } from 'lucide-react';
import { LocationDetails, WeatherWarning, AlertsResponse } from '../types';
import { api } from '../services/api';

interface AlertsPageProps {
  location: LocationDetails;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ location }) => {
  const [data, setData] = useState<AlertsResponse | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'watch' | 'advisory'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const res = await api.getAlerts(location.latitude, location.longitude);
        setData(res);
      } catch (e) {
        console.error("Alerts fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [location.latitude, location.longitude]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-32 rounded-3xl bg-slate-200" />
        <div className="h-44 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const filteredAlerts = data?.alerts.filter(a => {
    if (selectedFilter === 'all') return true;
    return a.severity === selectedFilter;
  }) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Severe Weather Alert Bulletin Center</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          National Weather Forecasting Centre (NWFC) • {data?.location_name}
        </p>
      </div>

      {/* Severity Count Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedFilter('critical')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedFilter === 'critical' ? 'ring-2 ring-red-500 bg-red-50/80 border-red-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-ping" />
            <span>Critical (Red)</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.critical_count || 0}</div>
        </button>

        <button
          onClick={() => setSelectedFilter('warning')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedFilter === 'warning' ? 'ring-2 ring-orange-500 bg-orange-50/80 border-orange-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">Warning (Orange)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.warning_count || 0}</div>
        </button>

        <button
          onClick={() => setSelectedFilter('watch')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedFilter === 'watch' ? 'ring-2 ring-amber-500 bg-amber-50/80 border-amber-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Watch (Yellow)</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.watch_count || 0}</div>
        </button>

        <button
          onClick={() => setSelectedFilter('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedFilter === 'all' ? 'ring-2 ring-imd-blue bg-blue-50/80 border-blue-200' : 'bg-white border-slate-200'
          }`}
        >
          <div className="text-[11px] font-bold text-imd-blue uppercase tracking-wider">All Bulletins</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{data?.active_count || 0}</div>
        </button>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No Severe Warnings in this Category</h3>
            <p className="text-xs text-slate-500 mt-1">Normal seasonal atmospheric conditions prevailing.</p>
          </div>
        ) : (
          filteredAlerts.map((w) => {
            const isRed = w.severity === 'critical';
            const isOrange = w.severity === 'warning';
            return (
              <div
                key={w.id}
                className={`rounded-2xl p-5 sm:p-6 border transition-all ${
                  isRed
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : isOrange
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isRed ? 'bg-red-600 text-white' : (isOrange ? 'bg-orange-600 text-white' : 'bg-amber-100 text-amber-800')
                  }`}>
                    {w.severity.toUpperCase()} ALERT
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{w.id}</span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-extrabold">{w.title}</h3>
                  <p className="text-xs mt-1.5 leading-relaxed text-slate-700">
                    {w.description}
                  </p>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-white/80 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900">Official Action Advisory: </span>
                  <span className="text-slate-700">{w.action_advisory}</span>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Valid: {w.start_time} to {w.end_time}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Area: {w.affected_area}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Official Bulletin Metadata */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Source: {data?.official_source}</span>
        </div>
        <span className="text-[11px] text-slate-400">Issued: {data?.bulletin_issued}</span>
      </div>
    </div>
  );
};
