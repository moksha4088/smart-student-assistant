import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandCenter } from './components/CommandCenter';
import { AttendanceDecisionMaker } from './components/AttendanceDecisionMaker';
import { AskCollegeChat } from './components/AskCollegeChat';
import { ExamSurvivalMode } from './components/ExamSurvivalMode';
import { CGPAPlanner } from './components/CGPAPlanner';
import { SmartTimetable } from './components/SmartTimetable';
import { AssignmentPrioritizer } from './components/AssignmentPrioritizer';
import { CampusExplorer } from './components/CampusExplorer';
import { PomodoroStudyMode } from './components/PomodoroStudyMode';
import { NoticeActionHub } from './components/NoticeActionHub';
import { ParentView } from './components/ParentView';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentProfileView } from './components/StudentProfileView';
import { HackathonDemoModal } from './components/HackathonDemoModal';
import { UnifiedAuthPortal } from './components/UnifiedAuthPortal';

import {
  SUBJECTS_DATA,
  INITIAL_DAILY_TASKS,
  INITIAL_ASSIGNMENTS,
  EXAMS_LIST,
  TIMETABLE_DATA,
  COLLEGE_NOTICES,
  DEMO_USERS,
} from './data/collegeDatabase';
import { calculateAcademicHealth } from './utils/academicEngine';
import { UserRole, DailyTask, Assignment, SubjectData, ExamInfo, Notice, AuthUser } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('apex_college_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return DEMO_USERS.student.user;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser?.role || 'student';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Login Modal & Switcher state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [loginModalRole, setLoginModalRole] = useState<UserRole>('student');

  // Core application data state
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_DAILY_TASKS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [subjects, setSubjects] = useState<SubjectData[]>(SUBJECTS_DATA);
  const [exams, setExams] = useState<ExamInfo[]>(EXAMS_LIST);
  const [notices, setNotices] = useState<Notice[]>(COLLEGE_NOTICES);

  // Focus & Survival states
  const [isExamModeActive, setIsExamModeActive] = useState<boolean>(true);
  const [preloadedFocusTask, setPreloadedFocusTask] = useState<string>('Revise AVL Trees (Data Structures)');
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  // Sync dark mode class with root html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Compute live Academic Health Score dynamically
  const health = calculateAcademicHealth(subjects, assignments, exams, tasks);

  const urgentAssignmentsCount = assignments.filter(
    (a) => a.status === 'pending' && a.priority === 'high'
  ).length;
  const unreadNotificationsCount = notices.filter((n) => n.urgency === 'urgent').length;
  const nearestExam = exams[0];

  // Authentication Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('apex_college_current_user', JSON.stringify(user));
    } catch (e) {
      // ignore
    }
    setIsAuthModalOpen(false);
    if (user.role === 'student') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('apex_college_current_user');
    } catch (e) {
      // ignore
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (DEMO_USERS[role]) {
      const user = DEMO_USERS[role].user;
      setCurrentUser(user);
      try {
        localStorage.setItem('apex_college_current_user', JSON.stringify(user));
      } catch (e) {
        // ignore
      }
    }
  };

  const handleOpenLoginModal = (role?: UserRole) => {
    if (role) setLoginModalRole(role);
    setIsAuthModalOpen(true);
  };

  // Action handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleAssignment = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, status: a.status === 'pending' ? 'submitted' : 'pending' }
          : a
      )
    );
  };

  const handleStartFocus = (taskTitle: string) => {
    setPreloadedFocusTask(taskTitle);
    setActiveTab('pomodoro');
  };

  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // IF NOT AUTHENTICATED: Display the Unified Central Auth Gateway
  if (!currentUser) {
    return (
      <div
        id="smart-college-assistant-app"
        className={`min-h-screen flex flex-col font-sans transition-colors ${
          darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          currentUser={currentUser}
          onOpenLoginModal={handleOpenLoginModal}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          academicScore={health.score}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenNotifications={() => handleNavigateToTab('notifications')}
          onOpenDemoTour={() => setIsDemoTourOpen(true)}
          onNavigateToTab={handleNavigateToTab}
        />

        <div className="flex-1 flex items-center justify-center p-4">
          <UnifiedAuthPortal
            isOpen={true}
            isModal={false}
            onLoginSuccess={handleLoginSuccess}
            darkMode={darkMode}
            initialRole={currentRole}
          />
        </div>

        <HackathonDemoModal
          isOpen={isDemoTourOpen}
          onClose={() => setIsDemoTourOpen(false)}
          onNavigateToTab={handleNavigateToTab}
          darkMode={darkMode}
        />
      </div>
    );
  }

  return (
    <div
      id="smart-college-assistant-app"
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        academicScore={health.score}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => handleNavigateToTab('notifications')}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onNavigateToTab={handleNavigateToTab}
      />

      {/* Main Layout (Desktop Sidebar + Content Body) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-6">
        {/* Sidebar only shown in student mode */}
        {currentRole === 'student' && (
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleNavigateToTab}
            urgentAssignmentsCount={urgentAssignmentsCount}
            unreadNotificationsCount={unreadNotificationsCount}
            isExamModeActive={isExamModeActive}
            darkMode={darkMode}
          />
        )}

        {/* View Routing / Display */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {/* Role views */}
          {currentRole === 'parent' && (
            <ParentView
              health={health}
              darkMode={darkMode}
              currentUser={currentUser}
              onOpenLoginModal={handleOpenLoginModal}
              onLogout={handleLogout}
            />
          )}

          {currentRole === 'faculty' && (
            <FacultyDashboard
              darkMode={darkMode}
              currentUser={currentUser}
              onOpenLoginModal={handleOpenLoginModal}
              onLogout={handleLogout}
            />
          )}

          {currentRole === 'admin' && <AdminDashboard darkMode={darkMode} />}

          {/* Student View Tabs */}
          {currentRole === 'student' && (
            <>
              {activeTab === 'dashboard' && (
                <CommandCenter
                  health={health}
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onStartFocus={handleStartFocus}
                  subjects={subjects}
                  nearestExam={nearestExam}
                  onNavigate={handleNavigateToTab}
                  isExamModeActive={isExamModeActive}
                  onToggleExamMode={() => setIsExamModeActive(!isExamModeActive)}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'ai-assistant' && (
                <AskCollegeChat darkMode={darkMode} />
              )}

              {activeTab === 'attendance' && (
                <AttendanceDecisionMaker subjects={subjects} darkMode={darkMode} />
              )}

              {activeTab === 'academics' && (
                <CGPAPlanner subjects={subjects} darkMode={darkMode} />
              )}

              {activeTab === 'study-planner' && (
                <ExamSurvivalMode
                  exams={exams}
                  subjects={subjects}
                  isExamModeActive={isExamModeActive}
                  onToggleExamMode={() => setIsExamModeActive(!isExamModeActive)}
                  onStartFocus={handleStartFocus}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'timetable' && (
                <SmartTimetable
                  slots={TIMETABLE_DATA}
                  onNavigate={handleNavigateToTab}
                  onStartFocus={handleStartFocus}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'assignments' && (
                <AssignmentPrioritizer
                  assignments={assignments}
                  onToggleAssignment={handleToggleAssignment}
                  onStartFocus={handleStartFocus}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'campus' && (
                <CampusExplorer darkMode={darkMode} />
              )}

              {activeTab === 'pomodoro' && (
                <PomodoroStudyMode
                  initialTaskTitle={preloadedFocusTask}
                  onNavigate={handleNavigateToTab}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'notifications' && (
                <NoticeActionHub
                  notices={notices}
                  onNavigate={handleNavigateToTab}
                  onActivateExamMode={() => setIsExamModeActive(true)}
                  darkMode={darkMode}
                />
              )}

              {activeTab === 'profile' && (
                <StudentProfileView
                  darkMode={darkMode}
                  currentUser={currentUser}
                  onOpenLoginModal={handleOpenLoginModal}
                  onLogout={handleLogout}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Multi-Portal Authentication Modal */}
      <UnifiedAuthPortal
        isOpen={isAuthModalOpen}
        isModal={true}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        darkMode={darkMode}
        initialRole={loginModalRole}
      />

      {/* Guided Hackathon Judge Walkthrough Modal */}
      <HackathonDemoModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateToTab={handleNavigateToTab}
        darkMode={darkMode}
      />
    </div>
  );
}

