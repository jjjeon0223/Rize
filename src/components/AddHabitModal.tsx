import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Habit, Cadence } from '../types/habit';
import { generateId, getTodayString } from '../utils/habitUtils';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  editHabit?: Habit;
}

const emojiOptions = ['💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '🎨', '✍️', '🎯', '🌱', '☕'];
const colorOptions = ['#10B981', '#7DD3FC', '#FB923C', '#C084FC', '#F472B6', '#FBBF24'];

export function AddHabitModal({ isOpen, onClose, onSave, editHabit }: AddHabitModalProps) {
  const [name, setName] = useState(editHabit?.name || '');
  const [emoji, setEmoji] = useState(editHabit?.emoji || '💪');
  const [color, setColor] = useState(editHabit?.color || '#10B981');
  const [cadence, setCadence] = useState<Cadence>(editHabit?.cadence || 'daily');
  const [target, setTarget] = useState(editHabit?.target?.toString() || '1');
  const [targetType, setTargetType] = useState<'times' | 'minutes'>(editHabit?.targetType || 'times');

  const handleSave = () => {
    if (!name.trim()) return;

    const habit: Habit = editHabit
      ? {
          ...editHabit,
          name: name.trim(),
          emoji,
          color,
          cadence,
          target: parseInt(target) || 1,
          targetType,
        }
      : {
          id: generateId(),
          name: name.trim(),
          emoji,
          color,
          cadence,
          target: parseInt(target) || 1,
          targetType,
          startDate: getTodayString(),
          isPaused: false,
          completions: {},
          createdAt: new Date().toISOString(),
        };

    onSave(habit);
    onClose();
    
    // Reset form
    setName('');
    setEmoji('💪');
    setColor('#10B981');
    setCadence('daily');
    setTarget('1');
    setTargetType('times');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-lg rounded-t-[32px] p-6 pointer-events-auto"
              style={{
                background: 'rgba(16, 18, 24, 0.95)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white/90" style={{ fontSize: '24px', fontWeight: 600 }}>
                  {editHabit ? 'Edit Habit' : 'New Habit'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <Label className="text-white/70 mb-3 block">Habit Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Drink water"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>

                {/* Emoji */}
                <div>
                  <Label className="text-white/70 mb-3 block">Emoji</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {emojiOptions.map((e) => (
                      <button
                        key={e}
                        onClick={() => setEmoji(e)}
                        className="aspect-square rounded-[12px] flex items-center justify-center transition-all"
                        style={{
                          background: emoji === e ? 'rgba(167, 243, 208, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: emoji === e ? '1px solid rgba(167, 243, 208, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '24px',
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <Label className="text-white/70 mb-3 block">Color</Label>
                  <div className="flex gap-3">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className="w-12 h-12 rounded-full relative"
                        style={{ background: c }}
                      >
                        {color === c && (
                          <motion.div
                            layoutId="colorIndicator"
                            className="absolute inset-0 rounded-full"
                            style={{ border: '3px solid white' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cadence */}
                <div>
                  <Label className="text-white/70 mb-3 block">Frequency</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['daily', 'weekly', 'custom'] as Cadence[]).map((c) => {
                      const labels = { daily: 'Daily', weekly: 'Weekly', custom: 'Custom' };
                      return (
                        <button
                          key={c}
                          onClick={() => setCadence(c)}
                          className="flex-1 py-3 rounded-[12px] transition-all"
                          style={{
                            background: cadence === c ? 'rgba(167, 243, 208, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            border: cadence === c ? '1px solid rgba(167, 243, 208, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: cadence === c ? '#A7F3D0' : 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {labels[c]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 mb-3 block">Goal</Label>
                    <Input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      min="1"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 mb-3 block">Unit</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setTargetType('times')}
                        className="py-3 rounded-[12px] transition-all"
                        style={{
                          background: targetType === 'times' ? 'rgba(167, 243, 208, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: targetType === 'times' ? '1px solid rgba(167, 243, 208, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: targetType === 'times' ? '#A7F3D0' : 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        Times
                      </button>
                      <button
                        onClick={() => setTargetType('minutes')}
                        className="py-3 rounded-[12px] transition-all"
                        style={{
                          background: targetType === 'minutes' ? 'rgba(167, 243, 208, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: targetType === 'minutes' ? '1px solid rgba(167, 243, 208, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: targetType === 'minutes' ? '#A7F3D0' : 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        Mins
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div
                  className="rounded-[20px] p-6"
                  style={{
                    background: 'rgba(16, 18, 24, 0.55)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="text-white/50 mb-3" style={{ fontSize: '13px' }}>Preview</div>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center rounded-[16px]"
                      style={{
                        width: '56px',
                        height: '56px',
                        background: `${color}20`,
                        fontSize: '28px',
                      }}
                    >
                      {emoji}
                    </div>
                    <div>
                      <h3 className="text-white/90 mb-1">{name || 'Habit name'}</h3>
                      <p className="text-white/60" style={{ fontSize: '14px' }}>
                        0 / {target} {targetType === 'times' ? 'times' : 'mins'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="flex-1"
                    style={{
                      background: name.trim() ? 'linear-gradient(135deg, #10B981, #A7F3D0)' : 'rgba(255, 255, 255, 0.1)',
                      color: name.trim() ? 'white' : 'rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {editHabit ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
