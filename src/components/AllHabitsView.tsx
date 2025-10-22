import { motion } from 'motion/react';
import { Habit } from '../types/habit';
import { calculateStreak } from '../utils/habitUtils';
import { Grid3x3, List, Pause, Play, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AllHabitsViewProps {
  habits: Habit[];
  onTogglePause: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

type ViewMode = 'grid' | 'list';

export function AllHabitsView({ habits, onTogglePause, onDelete, onEdit }: AllHabitsViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <div className="min-h-screen p-6 pb-24" style={{ background: '#0B0D12' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white/90" style={{ fontSize: '34px', fontWeight: 600 }}>
            All Habits
          </h1>
          
          {/* View toggle */}
          <div
            className="flex gap-1 p-1 rounded-[12px]"
            style={{
              background: 'rgba(16, 18, 24, 0.55)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded-[8px]"
              style={{
                background: viewMode === 'grid' ? 'rgba(167, 243, 208, 0.15)' : 'transparent',
                color: viewMode === 'grid' ? '#A7F3D0' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded-[8px]"
              style={{
                background: viewMode === 'list' ? 'rgba(167, 243, 208, 0.15)' : 'transparent',
                color: viewMode === 'list' ? '#A7F3D0' : 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-white/60">{habits.length} {habits.length === 1 ? 'habit' : 'habits'}</p>
      </motion.div>

      {/* Habits */}
      {habits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/40">No habits yet</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
          {habits.map((habit, index) => {
            const streak = calculateStreak(habit);
            
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-[20px] p-4 group relative"
                style={{
                  background: habit.isPaused ? 'rgba(16, 18, 24, 0.4)' : 'rgba(16, 18, 24, 0.55)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className={viewMode === 'grid' ? '' : 'flex items-center gap-4'}>
                  {/* Emoji */}
                  <div
                    className={`flex items-center justify-center rounded-[12px] ${viewMode === 'grid' ? 'mb-3' : ''}`}
                    style={{
                      width: viewMode === 'grid' ? '48px' : '56px',
                      height: viewMode === 'grid' ? '48px' : '56px',
                      background: `${habit.color}20`,
                      fontSize: viewMode === 'grid' ? '24px' : '28px',
                    }}
                  >
                    {habit.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/90 mb-1 truncate">{habit.name}</h3>
                    <div className="flex items-center gap-2 text-white/60" style={{ fontSize: '13px' }}>
                      <span>
                        {habit.cadence === 'daily' ? 'Daily' : habit.cadence === 'weekly' ? 'Weekly' : 'Custom'}
                      </span>
                      {streak > 0 && (
                        <>
                          <span>•</span>
                          <span style={{ color: '#A7F3D0' }}>{streak} days 🔥</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-2 ${viewMode === 'grid' ? 'absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity' : ''}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePause(habit.id);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      {habit.isPaused ? (
                        <Play className="w-4 h-4 text-white/70" />
                      ) : (
                        <Pause className="w-4 h-4 text-white/70" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${habit.name}" habit?`)) {
                          onDelete(habit.id);
                        }
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(244, 63, 94, 0.15)' }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {habit.isPaused && (
                  <div className="mt-3 text-center text-white/40" style={{ fontSize: '12px' }}>
                    Paused
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
