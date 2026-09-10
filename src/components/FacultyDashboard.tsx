import React, { useState } from 'react';
import {
  UserCheck,
  Upload,
  AlertTriangle,
  Users,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  Send,
  Plus,
  KeyRound,
  LogOut,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, UserRole } from '../types';

interface FacultyDashboardProps {
  darkMode: boolean;
  currentUser?: AuthUser | null;
  onOpenLoginModal?: (role?: UserRole) => void;
  onLogout?: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  darkMode,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const [warningSent, setWarningSent] = useState(false);
  const [selectedClass, setSelectedClass] = useState('CSD-1A');

  const facultyName = currentUser?.name || 'Prof. Dr. Aris Thorne';
  const facultyDept = currentUser?.department || 'Department of Computer Science & Design';
  const facultyIdentifier = currentUser?.identifier || 'FAC-CSD-108';

  const handleSendWarnings = () => {
    setWarningSent(true);
    confetti({ particleCount: 35, spread: 60 });
    setTimeout(() => setWarningSent(false), 4000);
  };

  return (
    <div id="faculty-dashboard-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Faculty Command Portal
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {facultyName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {facultyDept} • Code: {facultyIdentifier} • Data Structures (CSD101)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Assignment</span>
            </button>
            <button className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Bulk Marks Upload</span>
            </button>

            {onOpenLoginModal && (
              <button
                onClick={() => onOpenLoginModal('student')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                title="Switch to Student Portal"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden lg:inline">Switch Portal</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-all"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Class Intelligence Insight Card */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          darkMode ? 'bg-amber-950/20 border-amber-900/40' : 'bg-amber-50/60 border-amber-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                AI Class Health Diagnostic: 18 Students Below 75%
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                “18 students in your Data Structures class (Section CSD-1A) currently have attendance below the required 75% threshold. With Mid-Terms in 4 days, they risk condonation penalties.”
              </p>
            </div>
          </div>

          <button
            onClick={handleSendWarnings}
            disabled={warningSent}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all active:scale-95 flex items-center gap-2 ${
              warningSent ? 'bg-emerald-600' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {warningSent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            <span>{warningSent ? 'AI Warnings Dispatched!' : 'Send Automated Advisory Alerts'}</span>
          </button>
        </div>
      </div>

      {/* Section Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-slate-400">Average Attendance</p>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            78.4%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+1.2% this week</span>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-slate-400">Assignment Submissions</p>
          <p className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            52 / 65
          </p>
          <span className="text-[11px] text-slate-500">AVL Trees Implementation</span>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <p className="text-[10px] uppercase font-bold text-slate-400">Average Mid-Term Prep</p>
          <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
            64.2%
          </p>
          <span className="text-[11px] text-slate-500">Based on quiz analytics</span>
        </div>
      </div>

      {/* High-Risk Students List */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Students Requiring Attention (CSD-1A)
        </h2>

        <div className="space-y-3">
          {[
            { name: 'Mokshagna', roll: '26CSD042', att: 82, mathAtt: 58, risk: 'Medium', note: 'Strong in DS, Needs help in Mathematics' },
            { name: 'Rohan Sharma', roll: '26CSD015', att: 68, mathAtt: 62, risk: 'High', note: 'Below 70% in DS and Math' },
            { name: 'Priya Patel', roll: '26CSD031', att: 71, mathAtt: 70, risk: 'High', note: 'Needs 4 consecutive classes' },
            { name: 'Aditya Verma', roll: '26CSD054', att: 64, mathAtt: 55, risk: 'Critical', note: 'Habitual absence on Fridays' },
          ].map((st, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                  <span className="text-slate-400 font-mono">({st.roll})</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      st.risk === 'Critical'
                        ? 'bg-rose-500/10 text-rose-600'
                        : st.risk === 'High'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-blue-500/10 text-blue-600'
                    }`}
                  >
                    {st.risk} Risk
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mt-0.5">{st.note}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">DS Attendance</p>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{st.att}%</span>
                </div>
                <button className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                  Send Note
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
