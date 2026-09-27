import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check, AlertCircle } from 'lucide-react';
import { LocationDetails, LocationSearchResult } from '../../types';
import { api } from '../../services/api';

interface LocationModalProps {
  currentLocation: LocationDetails;
  onSelectLocation: (loc: LocationDetails) => void;
  onClose: () => void;
}

const PRESET_CITIES = [
  { name: "Bhuj", district: "Kutch", state: "Gujarat", lat: 23.2420, lon: 69.6669 },
  { name: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714 },
  { name: "Mumbai", district: "Mumbai City", state: "Maharashtra", lat: 19.0760, lon: 72.8777 },
  { name: "New Delhi", district: "Central Delhi", state: "Delhi", lat: 28.6139, lon: 77.2090 },
  { name: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", lat: 12.9716, lon: 77.5946 },
  { name: "Shimla", district: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734 },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  currentLocation,
  onSelectLocation,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await api.searchLocations(val);
        setResults(res);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleUseMyLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser. Please search manually below.");
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const resolved = await api.resolveLocation(pos.coords.latitude, pos.coords.longitude);
          onSelectLocation(resolved);
          onClose();
        } catch (err: any) {
          setGpsError("Could not resolve location coordinates. Reverting to manual search.");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError("Location access is disabled. Please select your district manually below.");
        } else {
          setGpsError("Unable to retrieve GPS coordinates. Please select manually below.");
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-imd-blue" />
            <h3 className="font-semibold text-slate-900 text-lg">Change Weather Location</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* GPS Auto Button */}
          <button
            onClick={handleUseMyLocation}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-imd-blue font-semibold text-sm border border-blue-200 transition-all shadow-sm disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? 'Detecting coordinates...' : 'Use My Current Location'}</span>
          </button>

          {gpsError && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Indian city, district, or station..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-imd-blue focus:bg-white transition-all"
            />
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border border-slate-100 p-1">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectLocation({
                      name: r.name,
                      district: r.district,
                      state: r.state,
                      country: "India",
                      latitude: r.latitude,
                      longitude: r.longitude,
                      is_coastal: r.is_coastal
                    });
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50 flex items-center justify-between text-sm transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{r.name}</span>
                    <span className="text-xs text-slate-500 ml-2">({r.district}, {r.state})</span>
                  </div>
                  {r.name === currentLocation.name && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Popular presets */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Popular Stations
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_CITIES.map((c) => {
                const isSelected = c.name === currentLocation.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      onSelectLocation({
                        name: c.name,
                        district: c.district,
                        state: c.state,
                        country: "India",
                        latitude: c.lat,
                        longitude: c.lon,
                        is_coastal: c.name === "Bhuj" || c.name === "Mumbai"
                      });
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-imd-blue text-white border-imd-blue shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-2">
            Mausam uses coordinates strictly for weather forecasts. No street addresses are stored.
          </div>
        </div>
      </div>
    </div>
  );
};
