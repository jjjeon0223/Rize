import { motion } from 'motion/react';
import { Habit } from '../types/habit';
import { calculateStats } from '../utils/habitUtils';
import { TrendingUp, Flame, Target, Calendar } from 'lucide-react';

interface InsightsViewProps {
  habits: Habit[];
}

export function InsightsView({ habits }: InsightsViewProps) {
  const activeHabits = habits.filter(h => !h.isPaused);

  const overallStats = activeHabits.reduce(
    (acc, habit) => {
      const stats = calculateStats(habit);
      return {
        totalCompletions: acc.totalCompletions + stats.totalCompletions,
        avgCompletionRate: acc.avgCompletionRate + stats.completionRate,
        longestStreak: Math.max(acc.longestStreak, stats.longestStreak),
        activeHabits: acc.activeHabits + 1,
      };
    },
    { totalCompletions: 0, avgCompletionRate: 0, longestStreak: 0, activeHabits: 0 }
  );

  if (activeHabits.length > 0) {
    overallStats.avgCompletionRate = overallStats.avgCompletionRate / activeHabits.length;
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-[20px] p-6"
      style={{
        background: 'rgba(16, 18, 24, 0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-white/60" style={{ fontSize: '14px' }}>{label}</span>
      </div>
      <div className="text-white/90" style={{ fontSize: '32px', fontWeight: 600 }}>
        {value}
      </div>
    </motion.div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 pb-24" style={{ background: '#0B0D12', WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-white/90 mb-2" style={{ fontSize: '34px', fontWeight: 600 }}>
          Insights
        </h1>
        <p className="text-white/60">Track your growth</p>
      </motion.div>

      {activeHabits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/40">No statistics yet</p>
        </div>
      ) : (
        <>
          {/* Overall Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard
              icon={Target}
              label="Active Habits"
              value={overallStats.activeHabits}
              color="#A7F3D0"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Completions"
              value={overallStats.totalCompletions}
              color="#7DD3FC"
            />
            <StatCard
              icon={Flame}
              label="Longest Streak"
              value={`${overallStats.longestStreak} days`}
              color="#FB923C"
            />
            <StatCard
              icon={Calendar}
              label="Avg Completion"
              value={`${Math.round(overallStats.avgCompletionRate)}%`}
              color="#C084FC"
            />
          </div>

          {/* Individual Habit Stats */}
          <div className="space-y-4">
            <h2 className="text-white/90 mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
              Habit Details
            </h2>
            {activeHabits.map((habit, index) => {
              const stats = calculateStats(habit);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[24px] p-6"
                  style={{
                    background: 'rgba(16, 18, 24, 0.55)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span style={{ fontSize: '28px' }}>{habit.emoji}</span>
                    <div>
                      <h3 className="text-white/90">{habit.name}</h3>
                      <p className="text-white/50" style={{ fontSize: '14px' }}>
                        {habit.cadence === 'daily' ? 'Daily' : habit.cadence === 'weekly' ? 'Weekly' : 'Custom'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-white/50 mb-1" style={{ fontSize: '13px' }}>Current Streak</div>
                      <div className="text-white/90" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {stats.currentStreak} days 🔥
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 mb-1" style={{ fontSize: '13px' }}>Longest Streak</div>
                      <div className="text-white/90" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {stats.longestStreak} days
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 mb-1" style={{ fontSize: '13px' }}>Completion Rate</div>
                      <div className="text-white/90" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {Math.round(stats.completionRate)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50 mb-1" style={{ fontSize: '13px' }}>Total Completions</div>
                      <div className="text-white/90" style={{ fontSize: '24px', fontWeight: 600 }}>
                        {stats.totalCompletions}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.completionRate}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${habit.color}, ${habit.color}CC)`,
                      }}
                    />
                  </div>

                  {stats.completionRate >= 80 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 text-center"
                      style={{ color: '#A7F3D0', fontSize: '14px' }}
                    >
                      Amazing! Keep it going 👏
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
