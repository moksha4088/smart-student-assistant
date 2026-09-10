import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  CloudRain,
  Radio,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ambientSound } from '../utils/audioSynth';

interface PomodoroStudyModeProps {
  initialTaskTitle?: string;
  onNavigate: (tab: string) => void;
  darkMode: boolean;
}

export const PomodoroStudyMode: React.FC<PomodoroStudyModeProps> = ({
  initialTaskTitle = 'Revise AVL Trees (Data Structures)',
  onNavigate,
  darkMode,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientType, setAmbientType] = useState<'rain' | 'whitenoise' | 'library' | 'none'>('none');
  const [studyStreak, setStudyStreak] = useState<number>(5);
  const [completedSessions, setCompletedSessions] = useState<number>(2);
  const [activeTask, setActiveTask] = useState<string>(initialTaskTitle);

  useEffect(() => {
    if (initialTaskTitle) {
      setActiveTask(initialTaskTitle);
    }
  }, [initialTaskTitle]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      ambientSound.playChime();
      ambientSound.stopAmbient();
      setAmbientType('none');
      setCompletedSessions((prev) => prev + 1);
      confetti({ particleCount: 60, spread: 80 });
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => {
    if (!isRunning && ambientType !== 'none') {
      ambientSound.startAmbient(ambientType);
    } else if (isRunning) {
      ambientSound.stopAmbient();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
    ambientSound.stopAmbient();
    setAmbientType('none');
  };

  const handleSetMode = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
    ambientSound.stopAmbient();
    setAmbientType('none');
  };

  const handleAmbientChange = (type: 'rain' | 'whitenoise' | 'library' | 'none') => {
    setAmbientType(type);
    if (type === 'none') {
      ambientSound.stopAmbient();
    } else if (isRunning) {
      ambientSound.startAmbient(type);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;

  return (
    <div id="pomodoro-study-view" className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Title & Streak Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-500" />
            Deep Focus & Study Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Scientifically optimized interval sessions with synthesized ambient soundscapes.
          </p>
        </div>

        {/* Study streak counter */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
          <div className="text-xs">
            <p className="font-bold text-slate-900 dark:text-white leading-none">
              {studyStreak} Days Streak
            </p>
            <span className="text-[10px] text-slate-500">{completedSessions} sessions today</span>
          </div>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div
        id="pomodoro-timer-card"
        className={`p-8 rounded-3xl border text-center transition-all relative overflow-hidden ${
          darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        {/* Preset Interval Buttons */}
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 mb-6">
          {[
            { label: '25m Focus', mins: 25 },
            { label: '50m Deep', mins: 50 },
            { label: '5m Short Break', mins: 5 },
            { label: '15m Long Break', mins: 15 },
          ].map((mode) => (
            <button
              key={mode.mins}
              onClick={() => handleSetMode(mode.mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                durationMinutes === mode.mins
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Active Task Name Input / Editor */}
        <div className="max-w-md mx-auto mb-6">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Study Objective:
          </label>
          <input
            type="text"
            value={activeTask}
            onChange={(e) => setActiveTask(e.target.value)}
            className="w-full text-center text-sm font-bold text-slate-900 dark:text-white bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Big Digital Clock */}
        <div className="my-6">
          <span className="font-mono text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Circular / Line Progress Bar */}
        <div className="w-full max-w-md mx-auto h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            id="pomodoro-play-btn"
            onClick={handleStartPause}
            className={`px-8 py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
          </button>

          <button
            id="pomodoro-reset-btn"
            onClick={handleReset}
            className="p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Generator Controls */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            Synthesized Ambient Audio Generator (Zero Bandwidth Web Audio)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'none', label: 'Off', icon: VolumeX },
              { id: 'rain', label: 'Rain Sounds', icon: CloudRain },
              { id: 'whitenoise', label: 'White Noise', icon: Radio },
              { id: 'library', label: 'Library Hum', icon: BookOpen },
            ].map((sound) => {
              const Icon = sound.icon;
              const isSelected = ambientType === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => handleAmbientChange(sound.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{sound.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
