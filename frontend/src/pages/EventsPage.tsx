import React, { useState, useEffect } from 'react';
import { PartyPopper, Plus, Trash2, Calendar, Clock, MapPin, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { MausamEvent } from '../types';
import { api } from '../services/api';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<MausamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New event form state
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-18');
  const [eventTime, setEventTime] = useState('18:00');
  const [locationName, setLocationName] = useState('Ahmedabad');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) return;
    setIsSubmitting(true);
    try {
      const searchRes = await api.searchLocations(locationName);
      const matched = searchRes.length > 0 ? searchRes[0] : { latitude: 23.0225, longitude: 72.5714 };

      await api.addEvent({
        title,
        event_date: eventDate,
        event_time: eventTime,
        location_name: locationName,
        latitude: matched.latitude,
        longitude: matched.longitude
      });
      setShowModal(false);
      setTitle('');
      await fetchEvents();
    } catch (e) {
      console.error("Create event error", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
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
            <PartyPopper className="w-5 h-5 text-indigo-600" />
            <span>Outdoor Event Weather Planning</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atmospheric comfort score and contingency guidance for public and family events
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-imd-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Event</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-slate-200" />
        </div>
      ) : events.length === 0 ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
          <PartyPopper className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800">No Events Planned Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Add an open-air event to calculate its Outdoor Comfort Index.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{ev.event_date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.event_time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.location_name}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(ev.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Comfort Score & Advisory */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col items-center justify-center text-indigo-700 font-extrabold shrink-0">
                    <span className="text-2xl leading-none">{ev.outdoor_comfort_score}</span>
                    <span className="text-[9px] text-indigo-500 uppercase font-semibold">/ 100</span>
                  </div>

                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-800">Comfort Verdict</div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{ev.comfort_verdict}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ev.advisory}</div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="text-slate-400">Forecast Temp</div>
                  <div className="text-base font-extrabold text-slate-800">{ev.forecast_temp}°C</div>
                  <div className="text-slate-500">Rain risk: {ev.rain_risk}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 italic">
                App-generated outdoor comfort score based on multi-parameter environmental tolerances.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Plan Outdoor Event</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. College Fest, Community Marathon"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-imd-blue"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location / Venue City *</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Ahmedabad, Mumbai, Delhi"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-imd-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-imd-blue text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Calculating...' : 'Calculate Weather Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
