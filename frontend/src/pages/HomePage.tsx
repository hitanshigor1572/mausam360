import React, { useState } from 'react';
import { PersonalizedHomeResponse, PersonalizedCard, LocationDetails, PersonaKey } from '../types';
import { WeatherHeroCard } from '../components/weather/WeatherHeroCard';
import { SevereWarningCard } from '../components/weather/SevereWarningCard';
import { RunningScoreCard } from '../components/weather/RunningScoreCard';
import { AQICard } from '../components/weather/AQICard';
import { AgricultureCard } from '../components/weather/AgricultureCard';
import { CommuteCard } from '../components/weather/CommuteCard';
import { TravelAdviceCard } from '../components/weather/TravelAdviceCard';
import { FamilySafetyCard } from '../components/weather/FamilySafetyCard';
import { MarineCard } from '../components/weather/MarineCard';
import { EventPlannerCard } from '../components/weather/EventPlannerCard';
import { SunriseSunsetCard } from '../components/weather/SunriseSunsetCard';
import { RainWindRadarCard } from '../components/weather/RainWindRadarCard';
import { WhyThisCardModal } from '../components/common/WhyThisCardModal';
import { Sparkles, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';

interface HomePageProps {
  homeData: PersonalizedHomeResponse | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  homeData,
  loading,
  error,
  onRefresh,
  onNavigateTab
}) => {
  const [inspectedCard, setInspectedCard] = useState<PersonalizedCard | null>(null);

  if (loading && !homeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-pulse">
        {/* Skeleton hero */}
        <div className="h-64 rounded-3xl bg-slate-200" />
        <div className="h-6 w-48 bg-slate-200 rounded-md" />
        <div className="space-y-4">
          <div className="h-44 rounded-2xl bg-slate-200" />
          <div className="h-44 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error && !homeData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-white border border-slate-200 shadow-md text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 text-lg">Unable to Load Weather Dashboard</h3>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <button
          onClick={onRefresh}
          className="mt-4 px-5 py-2.5 rounded-xl bg-imd-blue text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!homeData) return null;

  const renderCard = (card: PersonalizedCard) => {
    switch (card.type) {
      case 'warning_alert':
        return (
          <SevereWarningCard
            key={card.id}
            warning={card.data.warning}
            isCritical={card.data.is_critical}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'running_score':
        return (
          <RunningScoreCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'health_wellness':
        return (
          <AQICard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'agriculture':
        return (
          <AgricultureCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'commute':
        return (
          <CommuteCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'travel_advice':
        return (
          <TravelAdviceCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
            onNavigateToTravel={() => onNavigateTab('destinations')}
          />
        );
      case 'family_routine':
        return (
          <FamilySafetyCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'marine_beach':
        return (
          <MarineCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'event_planner':
        return (
          <EventPlannerCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
            onNavigateToEvents={() => onNavigateTab('events')}
          />
        );
      case 'sun_astronomy':
        return (
          <SunriseSunsetCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      case 'rain_wind':
        return (
          <RainWindRadarCard
            key={card.id}
            data={card.data as any}
            onWhyThisCard={() => setInspectedCard(card)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Hero Weather Card */}
      <WeatherHeroCard
        weather={homeData.current_weather}
        location={homeData.location}
      />

      {/* Dynamic Stream Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-imd-blue">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Personalized Insights Stream
            </h2>
            <p className="text-[11px] text-slate-500">
              Ranked dynamically by the Mausam multi-factor scoring engine
            </p>
          </div>
        </div>

        {homeData.active_persona.toLowerCase().includes('saved profile') ? (
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500 font-medium">Profile:</span>
            <span className="text-emerald-700 font-bold">
              {homeData.active_persona.replace('Saved Profile', '').trim().replace(/^\((.*)\)$/, '$1') || 'Personalized'}
            </span>
          </div>
        ) : (
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-slate-500 font-medium">Demo Persona:</span>
            <span className="text-imd-blue font-bold capitalize">{homeData.active_persona}</span>
          </div>
        )}
      </div>

      {/* Dynamic Stream of Cards */}
      <div className="space-y-4">
        {homeData.cards.map((card) => renderCard(card))}
      </div>

      {/* Why This Card modal popup */}
      <WhyThisCardModal
        card={inspectedCard}
        onClose={() => setInspectedCard(null)}
      />
    </div>
  );
};
