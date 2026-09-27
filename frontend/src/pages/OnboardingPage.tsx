import React, { useState } from 'react';
import { CloudSun, MapPin, Navigation, ArrowRight, Check, AlertCircle, Heart, Activity, Compass, Users, Sprout, Car, Waves, PartyPopper } from 'lucide-react';
import { LocationDetails, PersonaKey } from '../types';
import { api } from '../services/api';

interface OnboardingPageProps {
  onComplete: (location: LocationDetails, selectedPersonas: PersonaKey[]) => void;
}

const INTERESTS: { key: PersonaKey; title: string; subtitle: string; icon: any; color: string }[] = [
  { key: 'fitness', title: 'Outdoor Fitness', subtitle: 'Running score, UV & wind', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { key: 'health', title: 'Health-Conscious', subtitle: 'AQI, UV & wellness advice', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { key: 'agriculture', title: 'Agriculture & Garden', subtitle: 'Rain forecast & soil moisture', icon: Sprout, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { key: 'travel', title: 'Traveller', subtitle: 'Destinations & packing checklist', icon: Compass, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { key: 'commuter', title: 'Daily Commute', subtitle: 'Transit hazards & road visibility', icon: Car, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { key: 'family', title: 'Parents & Family', subtitle: 'School commute & rain safety', icon: Users, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { key: 'beach', title: 'Beach & Marine', subtitle: 'Wave height, tides & coastal wind', icon: Waves, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  { key: 'event_planner', title: 'Outdoor Events', subtitle: 'Event comfort score & planning', icon: PartyPopper, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLocation, setSelectedLocation] = useState<LocationDetails>({
    name: "Bhuj",
    district: "Kutch",
    state: "Gujarat",
    country: "India",
    latitude: 23.2420,
    longitude: 69.6669,
    is_coastal: true
  });
  const [selectedInterests, setSelectedInterests] = useState<Set<PersonaKey>>(new Set(['fitness', 'health']));
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isPersonalizing, setIsPersonalizing] = useState(false);

  const handleUseLocation = () => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Location access is not supported by your browser. Please search manually below.");
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await api.resolveLocation(pos.coords.latitude, pos.coords.longitude);
          setSelectedLocation(loc);
          setLocLoading(false);
          setStep(3); // proceed to interests step
        } catch (e) {
          setLocError("Could not resolve location. Using manual fallback.");
          setLocLoading(false);
        }
      },
      (err) => {
        setLocLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocError("Location access is disabled.");
        } else {
          setLocError("Unable to retrieve GPS coordinates.");
        }
      },
      { timeout: 8000 }
    );
  };

  const handleManualSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      try {
        const res = await api.searchLocations(val);
        setSearchResults(res);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSearchResults([]);
    }
  };

  const toggleInterest = (key: PersonaKey) => {
    const updated = new Set(selectedInterests);
    if (updated.has(key)) {
      if (updated.size > 1) {
        updated.delete(key);
      }
    } else {
      updated.add(key);
    }
    setSelectedInterests(updated);
  };

  const handleFinish = async () => {
    setIsPersonalizing(true);
    try {
      // Save interests to backend
      const interestObj: any = {};
      INTERESTS.forEach(i => {
        interestObj[i.key] = selectedInterests.has(i.key);
      });
      await api.saveProfile({
        name: "Citizen",
        home_city: selectedLocation.name,
        home_district: selectedLocation.district,
        home_state: selectedLocation.state,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        interests: interestObj
      });
    } catch (e) {
      console.warn("Profile save warning:", e);
    }

    setTimeout(() => {
      onComplete(selectedLocation, Array.from(selectedInterests));
    }, 900);
  };

  if (isPersonalizing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-imd-navy text-white flex items-center justify-center mb-6 shadow-xl animate-bounce">
          <CloudSun className="w-9 h-9 text-amber-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Personalizing Your Mausam Dashboard...</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Calculating multi-parameter weather scores for {selectedLocation.name} across your active interests.
        </p>
        <div className="mt-6 flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-imd-blue animate-pulse" />
          <div className="w-2.5 h-2.5 rounded-full bg-imd-blue animate-pulse delay-150" />
          <div className="w-2.5 h-2.5 rounded-full bg-imd-blue animate-pulse delay-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          <div className={`h-full bg-imd-blue transition-all duration-300 ${
            step === 1 ? 'w-1/3' : (step === 2 ? 'w-2/3' : 'w-full')
          }`} />
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="p-6 sm:p-10 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-imd-navy to-imd-blue text-white flex items-center justify-center mx-auto shadow-lg mb-6">
              <CloudSun className="w-9 h-9 text-sky-300" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-imd-blue border border-blue-200">
              Ministry of Earth Sciences • IMD
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
              Welcome to Mausam
            </h1>
            <p className="text-base font-semibold text-imd-blue mt-1">
              "Weather that adapts to you."
            </p>

            <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-md mx-auto">
              Get official weather observations, severe storm alerts, and intelligent recommendations personalized for your location, routine, and interests.
            </p>

            <div className="mt-8">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-imd-navy hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-xl transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="p-6 sm:p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-imd-blue flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Where should we get your weather from?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                We only use coordinates for local forecasts. Exact street addresses are never requested or stored.
              </p>
            </div>

            {/* Use My Location button */}
            <button
              onClick={handleUseLocation}
              disabled={locLoading}
              className="w-full flex items-center justify-center space-x-2.5 py-3.5 px-4 rounded-2xl bg-imd-blue hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 ${locLoading ? 'animate-spin' : ''}`} />
              <span>{locLoading ? 'Detecting your location...' : 'Use My Current Location'}</span>
            </button>

            {/* Error handling cases */}
            {locError && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold">{locError}</div>
                  <div className="mt-1 flex space-x-2">
                    <button onClick={handleUseLocation} className="underline font-bold text-amber-800">
                      Try Again
                    </button>
                    <span>•</span>
                    <span>Search manually below</span>
                  </div>
                </div>
              </div>
            )}

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold uppercase">Or Search Manually</span>
            </div>

            {/* Manual city search input */}
            <div className="space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleManualSearch(e.target.value)}
                placeholder="Search city e.g. Bhuj, Mumbai, Ahmedabad..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-imd-blue focus:bg-white transition-all"
              />

              {searchResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-1 bg-white space-y-1">
                  {searchResults.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedLocation({
                          name: r.name,
                          district: r.district,
                          state: r.state,
                          country: "India",
                          latitude: r.latitude,
                          longitude: r.longitude,
                          is_coastal: r.is_coastal
                        });
                        setStep(3);
                      }}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50 text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="font-semibold text-slate-800">{r.name}, {r.district}</span>
                      <span className="text-slate-400">{r.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Default Bhuj button */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Default Station: <strong>Bhuj, Gujarat</strong></span>
              <button
                onClick={() => setStep(3)}
                className="text-imd-blue font-bold hover:underline"
              >
                Use Bhuj & Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PERSONA INTERESTS SETUP */}
        {step === 3 && (
          <div className="p-6 sm:p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Step 3 of 3 • Location: {selectedLocation.name}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                What matters to you?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your routine and interests. The homepage rearranges dynamically to prioritize what you care about.
              </p>
            </div>

            {/* 8 Persona cards (Multi-selection enabled) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
              {INTERESTS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedInterests.has(item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleInterest(item.key)}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition-all ${
                      isSelected
                        ? 'border-imd-blue bg-blue-50/70 shadow-xs ring-1 ring-imd-blue'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>{item.title}</span>
                        {isSelected && (
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

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                ← Back
              </button>

              <button
                onClick={handleFinish}
                className="px-6 py-3 rounded-2xl bg-imd-navy hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Continue to Mausam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
