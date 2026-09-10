import React from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  TrendingUp,
  Calendar,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { STUDENT_PROFILE, SUBJECTS_DATA } from '../data/collegeDatabase';
import { AcademicHealthBreakdown, UserRole, AuthUser } from '../types';

interface ParentViewProps {
  health: AcademicHealthBreakdown;
  darkMode: boolean;
  currentUser?: AuthUser | null;
  onOpenLoginModal?: (role?: UserRole) => void;
  onLogout?: () => void;
}

export const ParentView: React.FC<ParentViewProps> = ({
  health,
  darkMode,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const lowAttendanceSubjects = SUBJECTS_DATA.filter((s) => s.attendancePct < 75);
  const parentName = currentUser?.name || STUDENT_PROFILE.parentName;

  return (
    <div id="parent-portal-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Parent / Guardian Portal
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Logged in as {parentName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring ward: <strong>{STUDENT_PROFILE.name}</strong> ({STUDENT_PROFILE.rollNumber}) • {STUDENT_PROFILE.departmentShort} 1st Year
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Academic Health Score */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 flex items-center gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Ward's Health Score</p>
                <p className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                  {health.score}/100
                </p>
              </div>
              <span className="px-2 py-1 rounded font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                {health.status} Standing
              </span>
            </div>

            {/* Portal Action Buttons */}
            <div className="flex items-center gap-2">
              {onOpenLoginModal && (
                <button
                  onClick={() => onOpenLoginModal('student')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                  title="Switch to Student Portal"
                >
                  <KeyRound className="w-3.5 h-3.5 text-purple-500" />
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
      </div>

      {/* Attendance Alerts for Parents */}
      <div
        className={`p-6 rounded-2xl border ${
          lowAttendanceSubjects.length > 0
            ? darkMode
              ? 'bg-rose-950/20 border-rose-900/40'
              : 'bg-rose-50/60 border-rose-200'
            : darkMode
            ? 'bg-slate-800/80 border-slate-700'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-sm font-bold tracking-tight">
            Urgent Attendance Alerts ({lowAttendanceSubjects.length} subjects below 75%)
          </h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
          College policy requires a minimum of 75% attendance in each course to sit for semester-end examinations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lowAttendanceSubjects.map((subj) => (
            <div
              key={subj.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{subj.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {subj.classesAttended} of {subj.classesConducted} classes attended
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Faculty: {subj.faculty}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black font-mono text-rose-600 dark:text-rose-400">
                  {subj.attendancePct}%
                </span>
                <p className="text-[10px] text-rose-500 font-semibold">Below 75%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Marks & Academic Performance */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Internal Assessment Scores & Subject Progress
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-2">Course</th>
                <th className="pb-2">Faculty</th>
                <th className="pb-2">Attendance</th>
                <th className="pb-2">Internal Score</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SUBJECTS_DATA.map((s) => (
                <tr key={s.id} className="py-2.5">
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                    {s.name} <span className="text-slate-400 font-normal">({s.code})</span>
                  </td>
                  <td className="py-2.5 text-slate-500">{s.faculty}</td>
                  <td className="py-2.5 font-mono">
                    <span
                      className={`font-bold ${
                        s.attendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {s.attendancePct}%
                    </span>
                  </td>
                  <td className="py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {s.internalMarks} / {s.maxInternalMarks}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.internalMarks >= 40
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : s.internalMarks >= 30
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-rose-500/10 text-rose-600'
                      }`}
                    >
                      {s.internalMarks >= 40 ? 'Excellent' : s.internalMarks >= 30 ? 'Satisfactory' : 'Needs Help'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Advisor Contact Card */}
      <div
        className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
            AT
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Advisor: {STUDENT_PROFILE.advisor}
            </h3>
            <p className="text-xs text-slate-500">
              Department of Computer Science & Engineering (Data Science)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${STUDENT_PROFILE.advisorEmail}`}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Advisor</span>
          </a>
          <button
            onClick={() => alert(`Advisor Office Hours: Fridays 3:15 PM - 5:00 PM at Tech Block A Room 314.`)}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Schedule Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
