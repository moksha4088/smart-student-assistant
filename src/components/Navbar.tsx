import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  Bell,
  GraduationCap,
  Users,
  ShieldCheck,
  UserCheck,
  PlayCircle,
  Activity,
  LogOut,
  ChevronDown,
  LogIn,
  KeyRound,
} from 'lucide-react';
import { UserRole, AuthUser } from '../types';
import { STUDENT_PROFILE } from '../data/collegeDatabase';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: AuthUser | null;
  onOpenLoginModal: (role?: UserRole) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  academicScore: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenDemoTour: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  onOpenLoginModal,
  onLogout,
  darkMode,
  onToggleDarkMode,
  academicScore,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenDemoTour,
  onNavigateToTab,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const displayName = currentUser?.name || (currentRole === 'student' ? STUDENT_PROFILE.name : currentRole === 'faculty' ? 'Prof. Dr. Aris Thorne' : currentRole === 'parent' ? 'Srinivasa Rao' : 'Dean of Academics');
  const displayAvatar = currentUser?.avatar || (currentRole === 'student' ? STUDENT_PROFILE.avatar : currentRole === 'faculty' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80');
  const displayIdentifier = currentUser?.identifier || (currentRole === 'student' ? '26CSD042' : currentRole === 'faculty' ? 'FAC-CSD-108' : '+91 98480 12345');

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full border-b transition-colors backdrop-blur-md ${
        darkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigateToTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight leading-none bg-gradient-to-r from-indigo-500 via-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Smart College Assistant
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Hackathon 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Your College. Your Data. Your AI Assistant.
              </p>
            </div>
          </button>
        </div>

        {/* Middle: Academic Health & Demo walkthrough pill */}
        <div className="hidden md:flex items-center gap-2.5">
          {currentRole === 'student' && (
            <button
              id="nav-academic-health-btn"
              onClick={() => onNavigateToTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                academicScore >= 75
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
              }`}
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Academic Health:</span>
              <span className="font-bold text-sm">{academicScore}/100</span>
            </button>
          )}

          <button
            id="nav-demo-tour-btn"
            onClick={onOpenDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Demo Scenario</span>
          </button>
        </div>

        {/* Right: Role & Portal switcher + Controls */}
        <div className="flex items-center gap-2">
          {/* Institutional Portals Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              id="role-student-btn"
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Student Portal: Mokshagna"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Student</span>
            </button>

            <button
              id="role-faculty-btn"
              onClick={() => onRoleChange('faculty')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'faculty'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Faculty Portal: Prof. Dr. Thorne"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Faculty</span>
            </button>

            <button
              id="role-parent-btn"
              onClick={() => onRoleChange('parent')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'parent'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Parent Portal: Srinivasa Rao"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Parent</span>
            </button>

            <button
              id="role-admin-btn"
              onClick={() => onRoleChange('admin')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Admin</span>
            </button>
          </div>

          {/* Quick Login / Portal Gateway Button */}
          <button
            id="nav-portals-modal-btn"
            onClick={() => onOpenLoginModal(currentRole)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition-all"
            title="Open Central Authentication Gateway"
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">Portals Login</span>
          </button>

          {/* Notifications Button */}
          <button
            id="nav-notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Account / Avatar Dropdown */}
          <div className="relative pl-1">
            <button
              id="nav-user-profile-menu-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left"
              title="Account and Portal Options"
            >
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30 object-cover"
              />
              <div className="hidden xl:block leading-tight">
                <p className="text-xs font-bold truncate max-w-[110px]">{displayName}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentRole} Portal</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-xl p-2 space-y-1 z-50 animate-in fade-in-50 zoom-in-95 ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold truncate">{displayName}</p>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                      {currentRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    ID: {displayIdentifier}
                  </p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">
                    Switch Campus Portal
                  </p>
                  <button
                    onClick={() => {
                      onRoleChange('student');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Student Portal</span>
                    </div>
                    {currentRole === 'student' && <span className="text-[10px] text-indigo-500 font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('faculty');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>Faculty Portal</span>
                    </div>
                    {currentRole === 'faculty' && <span className="text-[10px] text-blue-500 font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('parent');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      <span>Parent Portal</span>
                    </div>
                    {currentRole === 'parent' && <span className="text-[10px] text-purple-500 font-bold">Active</span>}
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenLoginModal(currentRole);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Multi-Portal Login Screen</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out from Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
