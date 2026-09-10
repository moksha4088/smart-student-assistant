import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  Calendar,
  AlertCircle,
  Play,
  CheckCircle2,
  Sparkles,
  Filter,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment } from '../types';

interface AssignmentPrioritizerProps {
  assignments: Assignment[];
  onToggleAssignment: (id: string) => void;
  onStartFocus: (taskTitle: string) => void;
  darkMode: boolean;
}

export const AssignmentPrioritizer: React.FC<AssignmentPrioritizerProps> = ({
  assignments,
  onToggleAssignment,
  onStartFocus,
  darkMode,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'submitted') return a.status === 'submitted';
    return true;
  });

  const handleToggle = (id: string, currentStatus: string) => {
    onToggleAssignment(id);
    if (currentStatus === 'pending') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  return (
    <div id="assignment-prioritizer-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-6 h-6 text-indigo-500" />
              Smart Assignment Prioritizer
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              AI Weighted
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized by <strong>Deadline Urgency + Difficulty + Estimated Time + Exam Proximity</strong>.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['all', 'pending', 'submitted'] as const).map((f) => (
            <button
              key={f}
              id={`filter-btn-${f}`}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Prioritized Assignment Cards */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment, index) => {
          const isSubmitted = assignment.status === 'submitted';
          const isHigh = assignment.priority === 'high';
          const isMedium = assignment.priority === 'medium';

          return (
            <div
              key={assignment.id}
              id={`assignment-card-${assignment.id}`}
              className={`p-5 rounded-2xl border transition-all ${
                isSubmitted
                  ? 'opacity-65 bg-slate-100/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  : isHigh
                  ? darkMode
                    ? 'bg-rose-950/20 border-rose-900/40 shadow-xs'
                    : 'bg-rose-50/50 border-rose-200 shadow-xs'
                  : isMedium
                  ? darkMode
                    ? 'bg-amber-950/20 border-amber-900/40'
                    : 'bg-amber-50/40 border-amber-200'
                  : darkMode
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      Rank #{index + 1}
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isHigh
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : isMedium
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {assignment.priority} Priority
                    </span>

                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {assignment.subject}
                    </span>

                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
                      Max: {assignment.maxMarks} marks
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold tracking-tight ${
                      isSubmitted
                        ? 'line-through text-slate-500 dark:text-slate-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {assignment.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {assignment.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {assignment.deadline}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Est: {assignment.estimatedTime}
                    </span>
                    <span>•</span>
                    <span>
                      Difficulty: <strong>{assignment.difficulty}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Format: <strong>{assignment.submissionType}</strong>
                    </span>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isSubmitted && (
                    <button
                      id={`focus-assignment-btn-${assignment.id}`}
                      onClick={() => onStartFocus(`${assignment.subject}: ${assignment.title}`)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Focus</span>
                    </button>
                  )}

                  <button
                    id={`toggle-assignment-btn-${assignment.id}`}
                    onClick={() => handleToggle(assignment.id, assignment.status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 ${
                      isSubmitted
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitted ? 'Submitted' : 'Mark as Done'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
