import { motion } from 'motion/react';
import { Habit } from '../types/habit';
import { getHeatmapData, getWeekdayFromDate } from '../utils/habitUtils';
import { useState } from 'react';

interface HeatmapViewProps {
  habits: Habit[];
}

type Scope = 'week' | 'month' | 'year';

export function HeatmapView({ habits }: HeatmapViewProps) {
  const [scope, setScope] = useState<Scope>('month');
  const [selectedHabit, setSelectedHabit] = useState<string | null>(
    habits.length > 0 ? habits[0].id : null
  );

  const habit = habits.find(h => h.id === selectedHabit);

  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderHeatmap = () => {
    if (!habit) return null;

    const data = getHeatmapData(habit, scope);
    
    // Group by weeks for better visualization
    const weeks: Array<Array<{ date: string; count: number; intensity: number; weekday: number }>> = [];
    let currentWeek: Array<{ date: string; count: number; intensity: number; weekday: number }> = [];
    
    data.forEach((item, index) => {
      const weekday = (getWeekdayFromDate(item.date) + 6) % 7; // Convert to Monday=0
      currentWeek.push({ ...item, weekday });
      
      if (weekday === 6 || index === data.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return (
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex flex-col gap-2 min-w-full">
          {/* Weekday labels */}
          <div className="flex gap-2 mb-2">
            <div className="w-8" /> {/* Spacer for labels */}
            {weekdayLabels.map((day, i) => (
              <div key={i} className="text-white/40 text-center" style={{ fontSize: '12px', width: '32px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {scope === 'week' ? (
            <div className="flex gap-2">
              <div className="w-8" />
              {data.map((item, index) => {
                const weekday = (getWeekdayFromDate(item.date) + 6) % 7;
                return (
                  <motion.div
                    key={item.date}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className="rounded-lg cursor-pointer"
                    style={{
                      width: '32px',
                      height: '32px',
                      background: item.count > 0
                        ? `rgba(167, 243, 208, ${0.2 + item.intensity * 0.8})`
                        : 'rgba(255, 255, 255, 0.05)',
                    }}
                    title={`${item.date}: ${item.count}회`}
                  />
                );
              })}
            </div>
          ) : (
            weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-2">
                {weekIndex === 0 && <div className="w-8 text-white/30" style={{ fontSize: '12px' }}>W{weekIndex + 1}</div>}
                {weekIndex > 0 && weekIndex % 4 === 0 && <div className="w-8 text-white/30" style={{ fontSize: '12px' }}>W{weekIndex + 1}</div>}
                {weekIndex > 0 && weekIndex % 4 !== 0 && <div className="w-8" />}
                
                {/* Fill empty days at start */}
                {weekIndex === 0 && week[0] && Array.from({ length: week[0].weekday }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ width: '32px', height: '32px' }} />
                ))}
                
                {week.map((item, index) => (
                  <motion.div
                    key={item.date}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (weekIndex * 7 + index) * 0.01 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className="rounded-lg cursor-pointer"
                    style={{
                      width: '32px',
                      height: '32px',
                      background: item.count > 0
                        ? `rgba(167, 243, 208, ${0.2 + item.intensity * 0.8})`
                        : 'rgba(255, 255, 255, 0.05)',
                    }}
                    title={`${item.date}: ${item.count}회`}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-6 justify-center">
          <span className="text-white/40" style={{ fontSize: '12px' }}>Less</span>
          {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
            <div
              key={i}
              className="rounded"
              style={{
                width: '16px',
                height: '16px',
                background: intensity === 0
                  ? 'rgba(255, 255, 255, 0.05)'
                  : `rgba(167, 243, 208, ${0.2 + intensity * 0.8})`,
              }}
            />
          ))}
          <span className="text-white/40" style={{ fontSize: '12px' }}>More</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 pb-24" style={{ background: '#0B0D12', WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-white/90 mb-2" style={{ fontSize: '34px', fontWeight: 600 }}>
          Progress
        </h1>
        <p className="text-white/60">Track your habit history</p>
      </motion.div>

      {/* Scope Selector */}
      <div
        className="flex gap-2 p-1 mb-6 rounded-[16px] w-fit"
        style={{
          background: 'rgba(16, 18, 24, 0.55)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {(['week', 'month', 'year'] as Scope[]).map((s) => {
          const labels = { week: 'Week', month: 'Month', year: 'Year' };
          const isActive = scope === s;
          
          return (
            <motion.button
              key={s}
              onClick={() => setScope(s)}
              className="relative px-6 py-2 rounded-[12px] transition-colors"
              whileTap={{ scale: 0.95 }}
              style={{
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeScope"
                  className="absolute inset-0 rounded-[12px]"
                  style={{ background: 'rgba(167, 243, 208, 0.15)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{labels[s]}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Habit Selector */}
      {habits.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {habits.map((h) => (
              <motion.button
                key={h.id}
                onClick={() => setSelectedHabit(h.id)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-[16px] flex-shrink-0"
                style={{
                  background: selectedHabit === h.id
                    ? 'rgba(16, 18, 24, 0.7)'
                    : 'rgba(16, 18, 24, 0.4)',
                  backdropFilter: 'blur(20px)',
                  border: selectedHabit === h.id
                    ? '1px solid rgba(167, 243, 208, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ fontSize: '20px' }}>{h.emoji}</span>
                <span className="text-white/90">{h.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap */}
      {habit ? (
        <motion.div
          key={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-[24px] p-6"
          style={{
            background: 'rgba(16, 18, 24, 0.55)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {renderHeatmap()}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-white/40">No habits to display</p>
        </div>
      )}
    </div>
  );
}
