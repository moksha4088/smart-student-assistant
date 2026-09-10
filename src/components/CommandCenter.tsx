import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Play,
  Flame,
  UserCheck,
  Building,
  Target,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyTask, SubjectData, ExamInfo } from '../types';
import { STUDENT_PROFILE } from '../data/collegeDatabase';
import { AcademicHealthBreakdown } from '../types';

interface CommandCenterProps {
  health: AcademicHealthBreakdown;
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onStartFocus: (taskTitle: string) => void;
  subjects: SubjectData[];
  nearestExam: ExamInfo;
  onNavigate: (tab: string) => void;
  isExamModeActive: boolean;
  onToggleExamMode: () => void;
  darkMode: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  health,
  tasks,
  onToggleTask,
  onStartFocus,
  subjects,
  nearestExam,
  onNavigate,
  isExamModeActive,
  onToggleExamMode,
  darkMode,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(2026, 8, 10)); // Fixed to 2026-09-10 as per prompt context

  const completedCount = tasks.filter((t) => t.completed).length;
  const criticalTasksCount = tasks.filter((t) => !t.completed && (t.priority === 'critical' || t.priority === 'high')).length;

  const handleTaskCheck = (taskId: string, currentCompleted: boolean) => {
    onToggleTask(taskId);
    if (!currentCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div id="command-center-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div
        id="student-header-banner"
        className={`p-6 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-900/30'
            : 'bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 border-indigo-100 shadow-xs'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Greeting & Student Details */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
              <span>•</span>
              <span className="font-mono">{STUDENT_PROFILE.semester} ({STUDENT_PROFILE.year})</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Good afternoon, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{STUDENT_PROFILE.name}</span>
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 font-medium">
                Dept: {STUDENT_PROFILE.departmentShort}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 font-medium">
                Roll: {STUDENT_PROFILE.rollNumber}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 font-medium">
                Current CGPA: <strong className="text-slate-900 dark:text-slate-100">{STUDENT_PROFILE.currentCGPA}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">
                Target: {STUDENT_PROFILE.targetCGPA}
              </span>
            </div>
          </div>

          {/* Right: Academic Health Score Box */}
          <div
            id="academic-health-card"
            className={`p-4 rounded-xl border flex items-center gap-4 ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Score Ring / Radial */}
            <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    health.score >= 75
                      ? 'text-emerald-500'
                      : health.score >= 60
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }
                  strokeDasharray={`${health.score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
                  {health.score}
                </span>
                <span className="text-[10px] text-slate-500 font-bold">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Academic Health
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    health.score >= 75
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {health.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs font-medium leading-snug">
                {health.summary}
              </p>
              <button
                onClick={() => onNavigate('academics')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
              >
                <span>View Full AI Breakdown</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Callout Banner */}
      <div
        id="decision-callout-banner"
        className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">
              AI Decision Principle
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              “Don’t just view your college numbers. Understand them and make better decisions today.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-indigo-700 hover:bg-blue-50 active:scale-95 transition-all shadow-xs"
          >
            Can I Miss Java?
          </button>
          <button
            onClick={() => onNavigate('study-planner')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-900/50 text-white border border-white/20 hover:bg-indigo-900/80 active:scale-95 transition-all"
          >
            Exam Plan
          </button>
        </div>
      </div>

      {/* Section 2: "WHAT SHOULD I DO TODAY?" AI FEATURE */}
      <div id="what-should-i-do-today-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                What should I do today?
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                AI Prioritized
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dynamically ranked by attendance margins, assignment deadlines, and exam proximity.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Progress: <strong className="text-slate-900 dark:text-white">{completedCount}/{tasks.length}</strong> completed
            </span>
            <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / Math.max(1, tasks.length)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Task cards list */}
        <div className="grid grid-cols-1 gap-3">
          {tasks.map((task, idx) => {
            const isCritical = task.priority === 'critical';
            const isHigh = task.priority === 'high';

            return (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className={`p-4 rounded-xl border transition-all ${
                  task.completed
                    ? 'opacity-60 bg-slate-100/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    : isCritical
                    ? darkMode
                      ? 'bg-rose-950/20 border-rose-900/40 shadow-xs'
                      : 'bg-rose-50/50 border-rose-200 shadow-xs'
                    : isHigh
                    ? darkMode
                      ? 'bg-amber-950/20 border-amber-900/40'
                      : 'bg-amber-50/40 border-amber-200'
                    : darkMode
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox button */}
                    <button
                      id={`task-checkbox-${task.id}`}
                      onClick={() => handleTaskCheck(task.id, task.completed)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isCritical
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : isHigh
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {task.priority} Priority
                        </span>

                        {task.subject && (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {task.subject}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm font-bold tracking-tight ${
                          task.completed
                            ? 'line-through text-slate-500 dark:text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* AI Reason string */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        <strong className="text-slate-700 dark:text-slate-200">AI Reason: </strong>
                        {task.reason}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Est: {task.estimatedTime}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Deadline: {task.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start Focus / Pomodoro button */}
                  {!task.completed && (
                    <button
                      id={`start-focus-btn-${task.id}`}
                      onClick={() => onStartFocus(task.title)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95"
                      title="Launch 25-minute Pomodoro focus timer with this task"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Start Focus</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leisure / Entertainment Guidance */}
        <div
          id="entertainment-advice-box"
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs ${
            criticalTasksCount > 0
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <p className="font-medium">
            {criticalTasksCount > 0 ? (
              <span>
                <strong>AI Study Recommendation: </strong> You have <strong>{criticalTasksCount} critical priorities</strong> remaining today. You should safely skip non-academic activities until these priorities are completed.
              </span>
            ) : (
              <span>
                <strong>All clear! </strong> High priority items for today are completed. You can safely relax or explore project hobbies!
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Grid of 3 Live Intelligence Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: Exam Survival Mode Ticker */}
        <div
          id="command-exam-module"
          className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Flame className="w-4 h-4 text-rose-500" />
                Exam Survival Mode
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {isExamModeActive ? 'Active' : 'Standby'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {nearestExam.subject}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {nearestExam.examType} • {nearestExam.venue}
            </p>

            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Countdown to Next Exam</p>
              <p className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                {nearestExam.daysRemaining} days 12 hours
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                Prep Progress: <strong>{nearestExam.prepProgressPct}%</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onNavigate('study-planner')}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-xs hover:from-rose-700 hover:to-orange-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{isExamModeActive ? 'View Emergency Timetable' : 'Activate Survival Mode'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Module 2: Attendance Alert & Quick Decision */}
        <div
          id="command-attendance-module"
          className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <UserCheck className="w-4 h-4 text-amber-500" />
                Attendance Decision
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                75% Threshold
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Can I Miss This Class?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive simulator & consecutive classes calculation.
            </p>

            <div className="mt-4 space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Java Programming</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">72% (Need 6 classes)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Engineering Math</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">58% (Alert Level)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onNavigate('attendance')}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Class Impact</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Module 3: Free Period & Campus Utility */}
        <div
          id="command-free-period-module"
          className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                <Building className="w-4 h-4 text-teal-500" />
                Smart Schedule & Campus
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                1h 20m Free
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming: Free Period
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              11:00 AM - 12:20 PM between Physics and Math.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs space-y-1.5">
              <p className="font-bold text-teal-800 dark:text-teal-300">
                Suggested High-Yield Activities:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-0.5 text-[11px]">
                <li>Complete DS AVL assignment in Library</li>
                <li>Visit Room 204 (Empty until 01:10 PM)</li>
                <li>Quick revision of Math double integrals</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <button
              onClick={() => onNavigate('timetable')}
              className="flex-1 py-2 px-2.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all text-center"
            >
              Timetable
            </button>
            <button
              onClick={() => onNavigate('campus')}
              className="flex-1 py-2 px-2.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all text-center"
            >
              Find Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
