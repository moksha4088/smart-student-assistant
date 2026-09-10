import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { Notice } from '../types';

interface NoticeActionHubProps {
  notices: Notice[];
  onNavigate: (tab: string) => void;
  onActivateExamMode: () => void;
  darkMode: boolean;
}

export const NoticeActionHub: React.FC<NoticeActionHubProps> = ({
  notices,
  onNavigate,
  onActivateExamMode,
  darkMode,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'urgent' | 'important' | 'info'>('all');

  const filteredNotices = notices.filter((n) => {
    if (filterUrgency === 'all') return true;
    return n.urgency === filterUrgency;
  });

  return (
    <div id="notice-action-hub-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-indigo-500" />
              Notice → Action Intelligence Hub
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Proactive AI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transform passive college announcements into immediate student tasks and calendar commitments.
          </p>
        </div>

        {/* Urgency Filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(['all', 'urgent', 'important', 'info'] as const).map((urgency) => (
            <button
              key={urgency}
              onClick={() => setFilterUrgency(urgency)}
              className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                filterUrgency === urgency
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {urgency === 'urgent' ? '🔴 Urgent' : urgency === 'important' ? '🟠 Important' : urgency === 'info' ? '🟢 Info' : 'All Notices'}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Action Cards */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isUrgent = notice.urgency === 'urgent';
          const isImportant = notice.urgency === 'important';

          return (
            <div
              key={notice.id}
              id={`notice-card-${notice.id}`}
              className={`p-6 rounded-2xl border transition-all ${
                isUrgent
                  ? darkMode
                    ? 'bg-rose-950/20 border-rose-900/40'
                    : 'bg-rose-50/60 border-rose-200'
                  : isImportant
                  ? darkMode
                    ? 'bg-amber-950/20 border-amber-900/40'
                    : 'bg-amber-50/50 border-amber-200'
                  : darkMode
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : isImportant
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {notice.urgency} Notice
                    </span>

                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {notice.category}
                    </span>

                    <span className="text-xs font-mono text-slate-400">
                      {notice.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {notice.content}
                  </p>

                  {/* AI Action Conversion Box */}
                  <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>Converted AI Action Item:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      <strong>AI Recommendation: </strong> {notice.actionSummary}
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="shrink-0 flex items-center gap-2">
                  {notice.id === 'notice-midterms' ? (
                    <button
                      onClick={() => {
                        onActivateExamMode();
                        onNavigate('study-planner');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Launch Exam Plan</span>
                    </button>
                  ) : notice.id === 'notice-hackathon' ? (
                    <button
                      onClick={() => onNavigate('campus')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Find Seminar Hall</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('assignments')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <span>View Tasks</span>
                    </button>
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
