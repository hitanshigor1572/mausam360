import React, { useState } from 'react';
import { ShieldAlert, Zap, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';
import { PersonaKey } from '../../types';

interface JudgeDemoBarProps {
  activePersona: string;
  onSelectPersona: (persona: PersonaKey | 'clear') => void;
  onToggleWarning: () => void;
  isSevereWarningActive: boolean;
  onOpenGuide: () => void;
}

const PERSONAS: { key: PersonaKey; label: string; icon: string }[] = [
  { key: 'fitness', label: 'Fitness', icon: '🏃' },
  { key: 'health', label: 'Health', icon: '❤️' },
  { key: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { key: 'travel', label: 'Traveller', icon: '✈️' },
  { key: 'commuter', label: 'Commuter', icon: '🚗' },
  { key: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { key: 'beach', label: 'Beach', icon: '🏖️' },
  { key: 'event_planner', label: 'Events', icon: '🎉' },
];

export const JudgeDemoBar: React.FC<JudgeDemoBarProps> = ({
  activePersona,
  onSelectPersona,
  onToggleWarning,
  isSevereWarningActive,
  onOpenGuide
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-imd-navy to-slate-900 text-white border-b border-blue-900/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Title */}
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              Instant Persona Transformation:
            </span>
          </div>

          {/* Action controls */}
          <div className="flex items-center space-x-2">
            {/* Severe Alert Simulator */}
            <button
              onClick={onToggleWarning}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
                isSevereWarningActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-rose-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Demonstrates that Severe Weather Warnings override all personal preferences (Priority 1)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isSevereWarningActive ? '🚨 Thunderstorm Active (Priority 1)' : 'Simulate Thunderstorm'}</span>
            </button>

            {/* Scenario Guide */}
            <button
              onClick={onOpenGuide}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Guide</span>
            </button>
          </div>
        </div>

        {/* Persona quick switch chips */}
        <div className="flex items-center space-x-2 mt-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Persona:
          </span>

          {/* Auto Saved Profile Option */}
          <button
            onClick={() => onSelectPersona('clear')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              !activePersona || activePersona === 'clear' || activePersona === 'auto'
                ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300 font-bold scale-105'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
            }`}
            title="Applies all your multi-selected interests from Settings"
          >
            <span>🎯</span>
            <span>Auto (My Saved Profile)</span>
            {(!activePersona || activePersona === 'clear' || activePersona === 'auto') && (
              <CheckCircle className="w-3 h-3 text-white ml-0.5" />
            )}
          </button>

          {PERSONAS.map(p => {
            const isActive = activePersona === p.key;
            return (
              <button
                key={p.key}
                onClick={() => onSelectPersona(p.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300 font-bold scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
                {isActive && <CheckCircle className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
