import React from 'react';
import { Calculator, Layers, History, Settings2 } from 'lucide-react';

export type ActiveTab = 'calculator' | 'comparison' | 'history' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  const tabs = [
    {
      id: 'calculator' as ActiveTab,
      label: 'Калькулятор сметы',
      icon: Calculator,
      badge: null,
    },
    {
      id: 'comparison' as ActiveTab,
      label: 'Сравнение пакетов',
      icon: Layers,
      badge: 'Basic / Pro',
    },
    {
      id: 'history' as ActiveTab,
      label: 'История расчетов',
      icon: History,
      badge: savedCount > 0 ? savedCount : null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Настройки тарифов',
      icon: Settings2,
      badge: null,
    },
  ];

  return (
    <div className="border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[11px] rounded-md font-mono ${
                      isActive
                        ? 'bg-violet-800 text-violet-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
