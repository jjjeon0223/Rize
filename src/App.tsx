import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Habit } from './types/habit';
import { getTodayString } from './utils/habitUtils';
import { TodayView } from './components/TodayView';
import { HeatmapView } from './components/HeatmapView';
import { InsightsView } from './components/InsightsView';
import { AllHabitsView } from './components/AllHabitsView';
import { AddHabitModal } from './components/AddHabitModal';
import { BottomNav } from './components/BottomNav';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type Tab = 'today' | 'heatmap' | 'insights' | 'habits';

const STORAGE_KEY = 'glass-habit-data';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

  // Load habits from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setHabits(data.habits || []);
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    }
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits }));
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  }, [habits]);

  const handleCompleteHabit = (habitId: string) => {
    const today = getTodayString();
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const currentCount = habit.completions[today] || 0;
          const newCount = currentCount + 1;
          
          // Show toast
          if (newCount >= habit.target) {
            toast.success('Check-in complete! 🎉', {
              description: `${habit.emoji} ${habit.name} completed`,
            });
          } else {
            toast.success(`${habit.emoji} ${newCount}/${habit.target} completed`);
          }
          
          return {
            ...habit,
            completions: {
              ...habit.completions,
              [today]: newCount,
            },
          };
        }
        return habit;
      })
    );
  };

  const handleSaveHabit = (habit: Habit) => {
    if (editingHabit) {
      setHabits((prev) => prev.map((h) => (h.id === habit.id ? habit : h)));
      toast.success('Habit updated');
      setEditingHabit(undefined);
    } else {
      setHabits((prev) => [...prev, habit]);
      toast.success('New habit added! 🌱');
    }
  };

  const handleTogglePause = (habitId: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const newPausedState = !habit.isPaused;
          toast.info(
            newPausedState ? 'Habit paused' : 'Habit resumed'
          );
          return { ...habit, isPaused: newPausedState };
        }
        return habit;
      })
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    toast.success('Habit deleted');
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingHabit(undefined);
  };

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: '#0B0D12',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <TodayView
              key="today"
              habits={habits}
              onComplete={handleCompleteHabit}
              onAddHabit={() => setIsAddModalOpen(true)}
            />
          )}
          {activeTab === 'heatmap' && <HeatmapView key="heatmap" habits={habits} />}
          {activeTab === 'insights' && <InsightsView key="insights" habits={habits} />}
          {activeTab === 'habits' && (
            <AllHabitsView
              key="habits"
              habits={habits}
              onTogglePause={handleTogglePause}
              onDelete={handleDeleteHabit}
              onEdit={handleEditHabit}
            />
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveHabit}
        editHabit={editingHabit}
      />

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(16, 18, 24, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      />
    </div>
  );
}
