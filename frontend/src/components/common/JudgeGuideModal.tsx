import React from 'react';
import { X, Award, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface JudgeGuideModalProps {
  onClose: () => void;
}

export const JudgeGuideModal: React.FC<JudgeGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-imd-navy to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-sky-400" />
            <div>
              <h3 className="font-bold text-lg">Guide</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Core Concept Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-blue-900 text-xs leading-relaxed">
              <strong className="text-imd-navy">SAME WEATHER DATA + USER PROFILE + CONTEXT = DIFFERENT HOMEPAGE.</strong><br/>
              Mausam avoids creating separate fragmented apps. Instead, one single homepage dynamically calculates multi-dimensional relevance scores to sort weather intelligence for each citizen.
            </p>
          </div>

          {/* Test Scenarios */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3">
              Key Features & Scenarios to Explore:
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-imd-blue text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Test Dynamic Persona Switching</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Click <strong>🏃 Fitness</strong>, <strong>🌾 Agriculture</strong>, or <strong>✈️ Traveller</strong> in the top Demo Toolbar. Observe how cards instantly rearrange based on calculated scores without page reload!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Test Severe Weather Priority (Section 9 Requirement)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Click <strong>🚨 Simulate Thunderstorm</strong>. Even if a user is set to Fitness or Agriculture, the <strong>Severe Thunderstorm Warning</strong> immediately takes Priority #1 slot with critical emergency actions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Inspect "Why Am I Seeing This?" Explainability</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Click the <strong>Why this card?</strong> badge on any card. It displays the transparent algorithm formula: Base Priority + Profile Interest + Weather Trigger + Time Fit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Explore Travel & Smart Packing Recommendations</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Go to the <strong>Travel</strong> tab or card. Notice automated smart luggage suggestions (umbrella if rain &gt; 40%, jacket if &lt; 15°C, SPF if UV high).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">5</span>
                  <span>Location Privacy & Error Resilience</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Click the location chip at the top (📍 Bhuj, Gujarat). Switch to Shimla, Mumbai, or use GPS detection. Never displays a blank screen or raw stack traces.
                </p>
              </div>
            </div>
          </div>

          {/* Transparency & Disclaimer note */}
          <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
            <strong>IMD Compliance Note:</strong> All activity scores, irrigation advisories, and packing checklists are explicitly labeled as <em>"App-generated scores"</em> and non-diagnostic recommendations to respect IMD guidelines.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-imd-navy text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Got it, Explore Mausam!
          </button>
        </div>
      </div>
    </div>
  );
};
