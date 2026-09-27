import React from 'react';
import { X, Sparkles, Sliders, ShieldAlert, Clock, CloudSun, UserCheck } from 'lucide-react';
import { PersonalizedCard } from '../../types';

interface WhyThisCardModalProps {
  card: PersonalizedCard | null;
  onClose: () => void;
}

export const WhyThisCardModal: React.FC<WhyThisCardModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  const b = card.score_breakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-imd-navy to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-lg">Personalization Transparency</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Card Evaluated</div>
            <div className="text-base font-bold text-slate-900 mt-0.5">{card.title}</div>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Category: {card.category}
            </div>
          </div>

          {/* Explanation Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Why Am I Seeing This?
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {card.explanation}
            </p>
          </div>

          {/* Transparent Scoring Formula */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              <span>Dynamic Scoring Breakdown</span>
              <span className="text-imd-navy font-bold text-sm">Final Score: {card.final_score}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Sliders className="w-4 h-4 text-slate-400" />
                  <span>Base Category Priority</span>
                </div>
                <span className="font-semibold text-slate-900">{b.base_priority} pts</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center space-x-2 text-blue-900">
                  <UserCheck className="w-4 h-4 text-blue-500" />
                  <span>User Profile Interest Weight (max 40)</span>
                </div>
                <span className="font-bold text-blue-700">+{b.profile_relevance} pts</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-sky-50/60 border border-sky-100">
                <div className="flex items-center space-x-2 text-sky-900">
                  <CloudSun className="w-4 h-4 text-sky-500" />
                  <span>Weather Condition Trigger (max 35)</span>
                </div>
                <span className="font-bold text-sky-700">+{b.weather_relevance} pts</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                <div className="flex items-center space-x-2 text-amber-900">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Time / Rush Window Fit (max 25)</span>
                </div>
                <span className="font-bold text-amber-700">+{b.time_relevance} pts</span>
              </div>

              {b.severe_alert_boost > 0 && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200">
                  <div className="flex items-center space-x-2 text-rose-900 font-semibold">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>🚨 Severe Alert Priority Boost</span>
                  </div>
                  <span className="font-extrabold text-rose-600">+{b.severe_alert_boost} pts</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-3">
            Mausam Dynamic Personalization Engine • MoES / IMD Specification SIH26076
          </div>
        </div>
      </div>
    </div>
  );
};
