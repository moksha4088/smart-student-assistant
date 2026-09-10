import React from 'react';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  CreditCard,
  Bus,
  ShieldCheck,
  Calendar,
  LogOut,
  KeyRound,
  UserCheck,
  Users,
} from 'lucide-react';
import { STUDENT_PROFILE } from '../data/collegeDatabase';
import { AuthUser, UserRole } from '../types';

interface StudentProfileViewProps {
  darkMode: boolean;
  currentUser?: AuthUser | null;
  onOpenLoginModal?: (role?: UserRole) => void;
  onLogout?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  darkMode,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const name = currentUser?.name || STUDENT_PROFILE.name;
  const rollNumber = currentUser?.identifier || STUDENT_PROFILE.rollNumber;
  const avatar = currentUser?.avatar || STUDENT_PROFILE.avatar;
  const email = currentUser?.email || 'mokshagna@apex.edu.in';

  return (
    <div id="student-profile-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-2xl ring-4 ring-indigo-500/20 object-cover"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Student ERP Portal Active
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {STUDENT_PROFILE.department}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                <span>Roll: <strong className="text-slate-700 dark:text-slate-200">{rollNumber}</strong></span>
                <span>•</span>
                <span>{STUDENT_PROFILE.year} ({STUDENT_PROFILE.semester})</span>
                <span>•</span>
                <span>Section: <strong className="text-slate-700 dark:text-slate-200">{STUDENT_PROFILE.section}</strong></span>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{email}</span>
              </div>
            </div>
          </div>

          {/* Quick Portal Switcher / Log Out buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            {onOpenLoginModal && (
              <button
                onClick={() => onOpenLoginModal('faculty')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                <span>Switch Portal / Log In</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Academic & Campus Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            Academic Registry Details
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-400">Current CGPA</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{STUDENT_PROFILE.currentCGPA}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-400">Target CGPA</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{STUDENT_PROFILE.targetCGPA}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-400">Academic Advisor</span>
              <span className="font-semibold text-slate-900 dark:text-white">{STUDENT_PROFILE.advisor}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Advisor Office</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tech Block A (Room 314)</span>
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            Campus Credentials & Clearance
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-400">Semester Fee Status</span>
              <span className="font-bold text-emerald-600">Cleared (Receipt #84920)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-400">Library Pass</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Active (2 books issued)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-400">Hostel / Commute</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Day Scholar (Bus Route #14)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Exam Clearance</span>
              <span className="font-bold text-amber-600">Pending Math Attendance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
