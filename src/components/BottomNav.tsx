import { motion } from 'motion/react';
import { Home, BarChart3, TrendingUp, Grid3x3 } from 'lucide-react';

type Tab = 'today' | 'heatmap' | 'insights' | 'habits';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'today' as Tab, icon: Home, label: 'Today' },
    { id: 'heatmap' as Tab, icon: BarChart3, label: 'Progress' },
    { id: 'insights' as Tab, icon: TrendingUp, label: 'Insights' },
    { id: 'habits' as Tab, icon: Grid3x3, label: 'All' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div
        className="mx-4 mb-4 rounded-[24px] px-2 py-3"
        style={{
          background: 'rgba(16, 18, 24, 0.9)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-[16px] transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[16px]"
                    style={{ background: 'rgba(167, 243, 208, 0.15)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className="w-6 h-6 relative z-10"
                  style={{ color: isActive ? '#A7F3D0' : 'rgba(255, 255, 255, 0.5)' }}
                />
                <span
                  className="relative z-10"
                  style={{
                    fontSize: '11px',
                    color: isActive ? '#A7F3D0' : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
