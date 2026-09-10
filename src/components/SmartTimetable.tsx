import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Sparkles,
  BookOpen,
  ArrowRight,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { TimetableSlot } from '../types';

interface SmartTimetableProps {
  slots: TimetableSlot[];
  onNavigate: (tab: string) => void;
  onStartFocus: (taskTitle: string) => void;
  darkMode: boolean;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const SmartTimetable: React.FC<SmartTimetableProps> = ({
  slots,
  onNavigate,
  onStartFocus,
  darkMode,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const daySlots = slots.filter((s) => s.day === selectedDay);
  const freePeriodSlots = daySlots.filter((s) => s.isFreePeriod);

  return (
    <div id="smart-timetable-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-indigo-500" />
              Smart Timetable & Free Period Intelligence
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Schedule AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time schedule with proactive free period detection and high-yield productivity suggestions.
          </p>
        </div>

        {/* Days selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              id={`day-selector-${day.toLowerCase()}`}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Free Period Intelligence Callout Banner */}
      {freePeriodSlots.length > 0 && (
        <div
          id="free-period-intelligence-banner"
          className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-teal-500/30 transition-all"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-teal-950 dark:text-teal-200">
                    Free Period Detected ({freePeriodSlots[0].freeDuration})
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold">
                    {freePeriodSlots[0].startTime} - {freePeriodSlots[0].endTime}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  “You have 1 hour 20 minutes free between your morning lectures. Instead of idly waiting, AI suggests these high-yield activities:”
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onStartFocus('DS AVL Assignment (Library)')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all active:scale-95"
              >
                Start Study Session
              </button>
              <button
                onClick={() => onNavigate('campus')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white transition-all active:scale-95"
              >
                Find Quiet Room
              </button>
            </div>
          </div>

          {/* 3 Suggested actionable options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-teal-500/20">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-teal-500/20 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">1. Complete DS Assignment</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Estimated time: 45 mins in Main Library (Level 2)</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-teal-500/20 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">2. Revise Java Concepts</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Quick refresh of exception hierarchies before next class</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-teal-500/20 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">3. Visit Room 204</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tech Block A (Air Conditioned & quiet study space)</p>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Slots Timeline */}
      <div className="space-y-3">
        {daySlots.map((slot, index) => {
          const isOngoing = index === 1; // Simulated live ongoing class for demo
          const isNext = index === 2;

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all ${
                slot.isFreePeriod
                  ? 'border-dashed border-teal-500/40 bg-teal-50/40 dark:bg-teal-950/20'
                  : isOngoing
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : darkMode
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Badge */}
                  <div className="min-w-28">
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">Slot {index + 1}</span>
                  </div>

                  {/* Subject Details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {slot.subject}
                      </h4>
                      {isOngoing && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white animate-pulse">
                          LIVE NOW
                        </span>
                      )}
                      {isNext && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          Next Class
                        </span>
                      )}
                      {slot.isFreePeriod && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300">
                          Free Period
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Room: <strong className="text-slate-700 dark:text-slate-300">{slot.room}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Faculty: <strong className="text-slate-700 dark:text-slate-300">{slot.faculty}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2">
                  {slot.isFreePeriod ? (
                    <button
                      onClick={() => onNavigate('campus')}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Find Empty Room</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {slot.code}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
