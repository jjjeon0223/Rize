import { motion } from 'motion/react';
import { Habit } from '../types/habit';
import { HabitCard } from './HabitCard';
import { Plus } from 'lucide-react';

interface TodayViewProps {
  habits: Habit[];
  onComplete: (habitId: string) => void;
  onAddHabit: () => void;
}

export function TodayView({ habits, onComplete, onAddHabit }: TodayViewProps) {
  const activeHabits = habits.filter(h => !h.isPaused);
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[today.getDay()];

  return (
    <div className="min-h-screen p-6 pb-24" style={{ background: '#0B0D12' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-white/60 mb-2" style={{ fontSize: '15px' }}>
          {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h1 className="text-white/90 mb-2" style={{ fontSize: '34px', fontWeight: 600 }}>
          {dayName}
        </h1>
        <p className="text-white/60">One more step today 🚀</p>
      </motion.div>

      {/* Habit Cards */}
      <div className="space-y-4">
        {activeHabits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-white/40 mb-4">No habits yet</p>
            <p className="text-white/30" style={{ fontSize: '14px' }}>
              Tap the + button to create your first habit
            </p>
          </motion.div>
        ) : (
          activeHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <HabitCard habit={habit} onComplete={onComplete} />
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddHabit}
        className="fixed bottom-32 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl z-50"
        style={{
          background: 'linear-gradient(135deg, #10B981, #A7F3D0)',
        }}
      >
        <Plus className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
}
