import React from 'react';
import { Home, CloudRain, ShieldAlert, Compass, Calendar, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  hasCriticalAlert?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  hasCriticalAlert = false
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'forecast', label: 'Forecast', icon: CloudRain },
    { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: hasCriticalAlert },
    { id: 'destinations', label: 'Travel', icon: Compass },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-imd-blue font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
