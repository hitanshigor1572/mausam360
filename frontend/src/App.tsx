import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { JudgeDemoBar } from './components/common/JudgeDemoBar';
import { LocationModal } from './components/common/LocationModal';
import { JudgeGuideModal } from './components/common/JudgeGuideModal';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { ForecastPage } from './pages/ForecastPage';
import { AlertsPage } from './pages/AlertsPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { EventsPage } from './pages/EventsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LocationDetails, PersonalizedHomeResponse, PersonaKey } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('mausam_onboarded') === 'true';
  });

  const [currentLocation, setCurrentLocation] = useState<LocationDetails>(() => {
    const saved = localStorage.getItem('mausam_location');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: "Bhuj",
      district: "Kutch",
      state: "Gujarat",
      country: "India",
      latitude: 23.2420,
      longitude: 69.6669,
      is_coastal: true
    };
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [homeData, setHomeData] = useState<PersonalizedHomeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect location on launch if permitted
  useEffect(() => {
    if (navigator.geolocation && !localStorage.getItem('mausam_location_manual')) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const loc = await api.resolveLocation(pos.coords.latitude, pos.coords.longitude);
            setCurrentLocation(loc);
            localStorage.setItem('mausam_location', JSON.stringify(loc));
          } catch (e) {
            console.warn("Could not auto-resolve coordinates:", e);
          }
        },
        () => {},
        { timeout: 7000 }
      );
    }
  }, []);

  // SIH Judge Demo State
  const [activeDemoPersona, setActiveDemoPersona] = useState<string>('auto');
  const [isSevereWarningActive, setIsSevereWarningActive] = useState<boolean>(false);

  // Modals
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Fetch personalized homepage data
  const fetchHomeFeed = async (personaOverride?: string, forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (forceRefresh) {
        await api.refreshWeather(currentLocation.latitude, currentLocation.longitude);
      }

      let personaToUse: string | undefined = undefined;
      if (personaOverride === 'clear') {
        personaToUse = undefined;
      } else if (personaOverride) {
        personaToUse = personaOverride;
      } else if (activeDemoPersona && activeDemoPersona !== 'auto' && activeDemoPersona !== 'clear') {
        personaToUse = activeDemoPersona;
      }

      const data = await api.getPersonalizedHome(
        currentLocation.latitude,
        currentLocation.longitude,
        personaToUse
      );
      setHomeData(data);
      if (personaOverride === 'clear') {
        setActiveDemoPersona('auto');
      } else if (personaToUse) {
        setActiveDemoPersona(personaToUse);
      }
      setIsSevereWarningActive(data.has_active_critical_warning);
    } catch (err: any) {
      console.error("Home feed fetch error:", err);
      setError(err.message || "Failed to connect to Mausam weather server.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOnboarded) {
      fetchHomeFeed();
    }
  }, [isOnboarded, currentLocation.latitude, currentLocation.longitude]);

  // Handle instant persona switch from SIH Demo Toolbar
  const handleSelectPersona = async (persona: PersonaKey | 'clear') => {
    const target = persona === 'clear' ? 'auto' : persona;
    setActiveDemoPersona(target);
    setActiveTab('home'); // Bring judge to home feed to observe rearrangement
    try {
      await api.setDemoPersona(persona);
      await fetchHomeFeed(persona, true);
    } catch (e) {
      console.error("Persona switch error:", e);
    }
  };

  // Handle severe thunderstorm warning simulation toggle
  const handleToggleSevereWarning = async () => {
    try {
      const res = await api.toggleSevereWarning();
      setIsSevereWarningActive(res.severe_warning_active);
      setActiveTab('home'); // Ensure judge sees Priority 1 override immediately
      await fetchHomeFeed(undefined, true);
    } catch (e) {
      console.error("Toggle warning error:", e);
    }
  };

  const handleOnboardingComplete = (loc: LocationDetails, personas: PersonaKey[]) => {
    setCurrentLocation(loc);
    setActiveDemoPersona('auto');
    localStorage.setItem('mausam_onboarded', 'true');
    setIsOnboarded(true);
  };

  const handleResetToOnboarding = () => {
    localStorage.removeItem('mausam_onboarded');
    setIsOnboarded(false);
  };

  // If first time user, display Onboarding
  if (!isOnboarded) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-16 md:pb-6">
      {/* SIH Judge Demonstration Sticky Toolbar */}
      <JudgeDemoBar
        activePersona={activeDemoPersona}
        onSelectPersona={handleSelectPersona}
        onToggleWarning={handleToggleSevereWarning}
        isSevereWarningActive={isSevereWarningActive}
        onOpenGuide={() => setShowGuideModal(true)}
      />

      {/* Official Government Navbar */}
      <Navbar
        location={currentLocation}
        onOpenLocationModal={() => setShowLocationModal(true)}
        onRefresh={() => fetchHomeFeed(undefined, true)}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        provider={homeData?.meta?.provider || 'mock'}
        hasCriticalAlert={isSevereWarningActive}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            homeData={homeData}
            loading={loading}
            error={error}
            onRefresh={() => fetchHomeFeed(undefined, true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastPage location={currentLocation} />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage location={currentLocation} />
        )}

        {activeTab === 'destinations' && (
          <DestinationsPage />
        )}

        {activeTab === 'events' && (
          <EventsPage />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            location={currentLocation}
            onLocationReset={() => setShowLocationModal(true)}
            onProfileUpdated={async () => {
              setActiveDemoPersona('auto');
              try {
                await api.setDemoPersona('clear');
              } catch {}
              await fetchHomeFeed('clear', true);
            }}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasCriticalAlert={isSevereWarningActive}
      />

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          currentLocation={currentLocation}
          onSelectLocation={(loc) => {
            setCurrentLocation(loc);
            localStorage.setItem('mausam_location', JSON.stringify(loc));
            localStorage.setItem('mausam_location_manual', 'true');
            setShowLocationModal(false);
          }}
          onClose={() => setShowLocationModal(false)}
        />
      )}

      {/* Judge Walkthrough Guide Modal */}
      {showGuideModal && (
        <JudgeGuideModal onClose={() => setShowGuideModal(false)} />
      )}
    </div>
  );
};

export default App;
