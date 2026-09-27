import React, { useState, useEffect } from 'react';
import { Settings, Shield, User, MapPin, Check, Save, RotateCcw, Activity, Heart, Sprout, Compass, Car, Users, Waves, PartyPopper } from 'lucide-react';
import { UserProfile, PersonaKey, LocationDetails } from '../types';
import { api } from '../services/api';

interface SettingsPageProps {
  location: LocationDetails;
  onLocationReset: () => void;
  onProfileUpdated: () => void;
}

const INTERESTS_META: { key: PersonaKey; title: string; subtitle: string; icon: any }[] = [
  { key: 'fitness', title: 'Outdoor Fitness', subtitle: 'Running score, UV & wind', icon: Activity },
  { key: 'health', title: 'Health-Conscious', subtitle: 'AQI, UV & wellness advice', icon: Heart },
  { key: 'agriculture', title: 'Agriculture & Garden', subtitle: 'Rain forecast & soil moisture', icon: Sprout },
  { key: 'travel', title: 'Traveller', subtitle: 'Destinations & packing checklist', icon: Compass },
  { key: 'commuter', title: 'Daily Commute', subtitle: 'Transit hazards & road visibility', icon: Car },
  { key: 'family', title: 'Parents & Family', subtitle: 'School commute & rain safety', icon: Users },
  { key: 'beach', title: 'Beach & Marine', subtitle: 'Wave height, tides & coastal wind', icon: Waves },
  { key: 'event_planner', title: 'Outdoor Events', subtitle: 'Event comfort score & planning', icon: PartyPopper },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  location,
  onLocationReset,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await api.getProfile();
        setProfile(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleInterest = (key: PersonaKey) => {
    if (!profile) return;
    const currentVal = profile.interests[key];
    const newInterests = {
      ...profile.interests,
      [key]: !currentVal
    };
    setProfile({
      ...profile,
      interests: newInterests
    });
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      await api.updateInterests(profile.interests);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      onProfileUpdated();
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  };

  if (loading || !profile) {
    return <div className="max-w-2xl mx-auto p-8 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-imd-navy" />
          <span>Profile & Personalization Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize your interest personas, station preferences, and privacy controls
        </p>
      </div>

      {/* Persona Multi-selection */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Active Interest Personas</h3>
            <p className="text-xs text-slate-500">Enable or disable interests to adapt your daily homepage stream</p>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-imd-blue hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved!' : 'Save Interests'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {INTERESTS_META.map(item => {
            const Icon = item.icon;
            const isChecked = Boolean(profile.interests[item.key]);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleInterest(item.key)}
                className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                  isChecked
                    ? 'border-imd-blue bg-blue-50/70 shadow-xs ring-1 ring-imd-blue'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>{item.title}</span>
                    {isChecked && (
                      <span className="w-4 h-4 rounded-full bg-imd-blue text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Units & Station Preferences */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
          Station & Unit Preferences
        </h3>

        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-800">Current Weather Station</div>
            <div className="text-slate-500">{location.name}, {location.district}, {location.state}</div>
          </div>
          <button
            onClick={onLocationReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
          >
            Change Station
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
          <div>
            <div className="font-semibold text-slate-800">Measurement System</div>
            <div className="text-slate-500">Celsius (°C) and km/h (Official MoES Standard)</div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-imd-blue font-bold">
            Metric (°C)
          </span>
        </div>
      </div>

      {/* Privacy Guarantee (Section 25 Compliance) */}
      <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 sm:p-6 space-y-2 text-xs">
        <div className="flex items-center space-x-2 font-bold text-slate-900">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Location Privacy & Data Protection Guarantee</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Mausam adheres strictly to Ministry of Earth Sciences guidelines. Your device coordinates are used solely to query local meteorological models and resolve the nearest weather observation station. We do not track, log, or sell precise street addresses or movement history.
        </p>
      </div>
    </div>
  );
};
