export type Cadence = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  cadence: Cadence;
  target: number;
  targetType: 'times' | 'minutes';
  startDate: string;
  reminderTime?: string;
  isPaused: boolean;
  completions: Record<string, number>; // date -> count
  createdAt: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  missedDays: number;
  bestTimeOfDay?: string;
}
