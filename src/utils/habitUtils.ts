import { Habit, HabitStats } from '../types/habit';

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayString = (): string => {
  return getDateString(new Date());
};

export const calculateStreak = (habit: Habit): number => {
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    
    if (habit.completions[dateStr] && habit.completions[dateStr] >= habit.target) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateLongestStreak = (habit: Habit): number => {
  const dates = Object.keys(habit.completions).sort();
  let longestStreak = 0;
  let currentStreak = 0;
  let prevDate: Date | null = null;

  dates.forEach((dateStr) => {
    const currentDate = new Date(dateStr);
    
    if (habit.completions[dateStr] >= habit.target) {
      if (prevDate) {
        const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, currentStreak);
      prevDate = currentDate;
    } else {
      currentStreak = 0;
      prevDate = null;
    }
  });

  return longestStreak;
};

export const calculateStats = (habit: Habit): HabitStats => {
  const currentStreak = calculateStreak(habit);
  const longestStreak = calculateLongestStreak(habit);
  const totalCompletions = Object.values(habit.completions).reduce((sum, count) => sum + count, 0);
  
  const startDate = new Date(habit.startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const completedDays = Object.keys(habit.completions).filter(
    date => habit.completions[date] >= habit.target
  ).length;
  
  const completionRate = daysSinceStart > 0 ? (completedDays / daysSinceStart) * 100 : 0;
  const missedDays = daysSinceStart - completedDays;
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
    missedDays,
  };
};

export const getHeatmapData = (habit: Habit, scope: 'week' | 'month' | 'year') => {
  const today = new Date();
  const data: Array<{ date: string; count: number; intensity: number }> = [];
  
  let days = 7;
  if (scope === 'month') days = 30;
  if (scope === 'year') days = 365;
  
  let maxCount = 1;
  const tempData: Record<string, number> = {};
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    const count = habit.completions[dateStr] || 0;
    tempData[dateStr] = count;
    maxCount = Math.max(maxCount, count);
  }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    const count = tempData[dateStr];
    const intensity = maxCount > 0 ? count / maxCount : 0;
    
    data.push({ date: dateStr, count, intensity });
  }
  
  return data;
};

export const getWeekdayFromDate = (dateStr: string): number => {
  const date = new Date(dateStr);
  return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
