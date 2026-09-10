import React from 'react';
import {
  LayoutDashboard,
  BotMessageSquare,
  UserCheck,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  MapPin,
  Flame,
  Bell,
  User,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  urgentAssignmentsCount: number;
  unreadNotificationsCount: number;
  isExamModeActive: boolean;
  darkMode: boolean;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'ai-assistant', label: 'AI Assistant', icon: BotMessageSquare, badge: 'Smart' },
  { id: 'attendance', label: 'Attendance', icon: UserCheck, badge: 'Decision' },
  { id: 'academics', label: 'Academics & CGPA', icon: GraduationCap, badge: null },
  { id: 'study-planner', label: 'Study & Exams', icon: Flame, badge: 'Survival' },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays, badge: 'Free 1h20m' },
  { id: 'assignments', label: 'Assignments', icon: FileCheck2, badge: '2 due' },
  { id: 'campus', label: 'Campus & Rooms', icon: MapPin, badge: 'Empty Rooms' },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 'Alerts' },
  { id: 'profile', label: 'Student Profile', icon: User, badge: null },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  urgentAssignmentsCount,
  unreadNotificationsCount,
  isExamModeActive,
  darkMode,
}) => {
  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col w-64 shrink-0 border-r min-h-[calc(100vh-4rem)] p-4 transition-colors select-none ${
          darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        {/* Exam Survival Mode Quick Banner */}
        {isExamModeActive && (
          <div
            onClick={() => onSelectTab('study-planner')}
            className="mb-4 p-3 rounded-xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 border border-rose-500/30 cursor-pointer hover:border-rose-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                Exam Mode Active
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">
                4d 12h
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Data Structures in 4 days. Click for emergency schedule.
            </p>
          </div>
        )}

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Decision Hub
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.id === 'assignments' && urgentAssignmentsCount > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {urgentAssignmentsCount}
                  </span>
                ) : item.id === 'notifications' && unreadNotificationsCount > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {unreadNotificationsCount}
                  </span>
                ) : item.badge ? (
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Digital Twin Mini Teaser at bottom */}
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onSelectTab('academics')}
            className="w-full p-3 rounded-xl bg-indigo-50 dark:bg-slate-800/80 border border-indigo-100 dark:border-indigo-900/40 text-left hover:border-indigo-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Academic Digital Twin
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                AI Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Simulation predicts 7.42 SGPA. Tap to simulate target 8.0.
            </p>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-bar"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 flex items-center justify-around transition-colors ${
          darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}
      >
        {[
          { id: 'dashboard', label: 'Command', icon: LayoutDashboard },
          { id: 'ai-assistant', label: 'Ask AI', icon: BotMessageSquare },
          { id: 'attendance', label: 'Attendance', icon: UserCheck },
          { id: 'study-planner', label: 'Exam Mode', icon: Flame },
          { id: 'timetable', label: 'Schedule', icon: CalendarDays },
          { id: 'campus', label: 'Campus', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
