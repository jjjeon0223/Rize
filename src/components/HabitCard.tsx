import { motion } from 'motion/react';
import { Habit } from '../types/habit';
import { calculateStreak, getTodayString } from '../utils/habitUtils';
import { Check, Pause } from 'lucide-react';
import { Progress } from './ui/progress';

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  onLongPress?: (habitId: string) => void;
}

export function HabitCard({ habit, onComplete, onLongPress }: HabitCardProps) {
  const today = getTodayString();
  const currentCount = habit.completions[today] || 0;
  const progress = Math.min((currentCount / habit.target) * 100, 100);
  const isCompleted = currentCount >= habit.target;
  const streak = calculateStreak(habit);

  const handleClick = () => {
    if (!isCompleted) {
      onComplete(habit.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="relative overflow-hidden rounded-[24px] p-6 cursor-pointer"
      style={{
        background: habit.isPaused
          ? 'rgba(16, 18, 24, 0.4)'
          : 'rgba(16, 18, 24, 0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Completion overlay */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(167, 243, 208, 0.1))',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(167, 243, 208, 0.2)' }}
          >
            <Check className="w-5 h-5" style={{ color: '#A7F3D0' }} />
          </motion.div>
        </motion.div>
      )}

      {/* Pause indicator */}
      {habit.isPaused && (
        <div className="absolute top-4 right-4 opacity-40">
          <Pause className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Emoji */}
        <div
          className="flex items-center justify-center rounded-[16px] flex-shrink-0"
          style={{
            width: '56px',
            height: '56px',
            background: `${habit.color}20`,
            fontSize: '28px',
          }}
        >
          {habit.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white/90 mb-1 truncate">{habit.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/60" style={{ fontSize: '14px' }}>
              {currentCount} / {habit.target} {habit.targetType}
            </span>
            {streak > 0 && (
              <>
                <span className="text-white/30">•</span>
                <span style={{ color: '#A7F3D0', fontSize: '14px' }}>
                  {streak} day streak 🔥
                </span>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="h-full rounded-full"
              style={{
                background: isCompleted
                  ? 'linear-gradient(90deg, #10B981, #A7F3D0)'
                  : `linear-gradient(90deg, ${habit.color}, ${habit.color}CC)`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
