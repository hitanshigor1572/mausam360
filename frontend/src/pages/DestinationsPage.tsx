import React, { useState, useEffect } from 'react';
import { Compass, Plus, Trash2, MapPin, Briefcase, Check, AlertCircle, CloudRain, Sun, X } from 'lucide-react';
import { SavedDestination } from '../types';
import { api } from '../services/api';

export const DestinationsPage: React.FC = () => {
  const [destinations, setDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New destination form state
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [category, setCategory] = useState('Leisure');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await api.getDestinations();
      setDestinations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName) return;
    setIsSubmitting(true);
    try {
      // Find coordinates from search
      const searchRes = await api.searchLocations(cityName);
      const matched = searchRes.length > 0 ? searchRes[0] : { latitude: 19.0760, longitude: 72.8777, state: "India" };

      await api.addDestination({
        name: cityName,
        state: stateName || matched.state,
        latitude: matched.latitude,
        longitude: matched.longitude,
        trip_date: tripDate,
        category: category
      });
      setShowAddModal(false);
      setCityName('');
      setStateName('');
      setTripDate('');
      await fetchDestinations();
    } catch (e) {
      console.error("Add destination error", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteDestination(id);
      setDestinations(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <span>Saved Destinations & Travel Weather</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time weather tracking and intelligent packing suggestions for your planned trips
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-imd-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Destinations List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-slate-200" />
        </div>
      ) : destinations.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
          <Compass className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800">No Destinations Saved Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Add your upcoming travel stops to receive smart packing lists.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4"
            >
              {/* Destination title, category & delete */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{d.name}</h3>
                    <span className="text-[11px] text-slate-400">{d.state}, {d.country} • {d.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {d.trip_date && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                      Trip: {d.trip_date}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live weather metrics */}
              {d.current_weather && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400">Current Temp</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{Math.round(d.current_weather.temperature)}°C</div>
                    <div className="text-[10px] text-slate-500">{d.current_weather.condition}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400">Rain Probability</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{d.current_weather.rain_probability}%</div>
                    <div className="text-[10px] text-slate-500">Chances today</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400">Humidity</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{d.current_weather.humidity}%</div>
                    <div className="text-[10px] text-slate-500">Relative humidity</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400">UV Level</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">{d.current_weather.uv_index}</div>
                    <div className="text-[10px] text-slate-500">Solar index</div>
                  </div>
                </div>
              )}

              {/* Warning notice if any */}
              {d.warning && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Travel Alert:</strong> {d.warning.title}</span>
                </div>
              )}

              {/* Smart Packing Suggestions */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center space-x-1.5 mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-sky-600" />
                  <span>Smart Packing Suggestions</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {d.packing_suggestions.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Travel Destination</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">City / Destination Name *</label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi, Shimla, London"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-imd-blue"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">State / Region (Optional)</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. Maharashtra, Himachal Pradesh"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-imd-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trip Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Leisure">Leisure / Holiday</option>
                    <option value="Business">Business</option>
                    <option value="Family">Family Visit</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-imd-blue text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
