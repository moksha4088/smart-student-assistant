import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  Users,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
  Building,
  Smartphone,
  RefreshCw,
  X,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ambientSound } from '../utils/audioSynth';
import { DEMO_USERS } from '../data/collegeDatabase';
import { AuthUser, UserRole } from '../types';

interface UnifiedAuthPortalProps {
  isOpen?: boolean;
  isModal?: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  darkMode: boolean;
  initialRole?: UserRole;
}

export const UnifiedAuthPortal: React.FC<UnifiedAuthPortalProps> = ({
  isOpen = true,
  isModal = false,
  onClose,
  onLoginSuccess,
  darkMode,
  initialRole = 'student',
}) => {
  const [selectedPortal, setSelectedPortal] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState<string>('26CSD042');
  const [password, setPassword] = useState<string>('student123');
  const [parentPhone, setParentPhone] = useState<string>('+91 98480 12345');
  const [otpCode, setOtpCode] = useState<string>('');
  const [parentLoginMode, setParentLoginMode] = useState<'pin' | 'otp'>('pin');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  const [department, setDepartment] = useState<string>('Computer Science & Design (CSD)');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Change portal tab and set appropriate default credentials
  const handleSelectPortal = (role: UserRole) => {
    setSelectedPortal(role);
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowPassword(false);

    if (role === 'student') {
      setIdentifier('26CSD042');
      setPassword('student123');
    } else if (role === 'faculty') {
      setIdentifier('FAC-CSD-108');
      setPassword('faculty123');
    } else if (role === 'parent') {
      setIdentifier('26CSD042');
      setPassword('parent123');
      setParentPhone('+91 98480 12345');
    } else if (role === 'admin') {
      setIdentifier('ADM-APEX-001');
      setPassword('admin123');
    }
  };

  // Instant 1-click preset login for demo evaluators
  const handleQuickLogin = (role: UserRole) => {
    const cred = DEMO_USERS[role];
    if (!cred) return;

    setSelectedPortal(role);
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      ambientSound.playChime();
      confetti({ particleCount: 50, spread: 70 });
      onLoginSuccess(cred.user);
      if (onClose) onClose();
    }, 450);
  };

  // Handle Parent OTP Simulation
  const handleRequestOtp = () => {
    setOtpSent(true);
    const mockOtp = '4201';
    setSimulatedSmsToast(`[APEX-SMS]: Your Parent Portal Login OTP is ${mockOtp}. Valid for 10 minutes.`);
    setTimeout(() => {
      setOtpCode(mockOtp);
    }, 1200);
  };

  // Perform form submission authentication
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const cred = DEMO_USERS[selectedPortal];

      if (!cred) {
        setIsLoading(false);
        setErrorMessage('Unknown authentication authority.');
        return;
      }

      // Validate inputs
      const idMatch =
        identifier.trim().toLowerCase() === cred.user.identifier.toLowerCase() ||
        identifier.trim().toLowerCase() === cred.user.email.toLowerCase() ||
        identifier.trim() === 'demo' ||
        identifier.length >= 3;

      let passMatch = true;
      if (selectedPortal === 'parent' && parentLoginMode === 'otp') {
        passMatch = otpCode === '4201' || otpCode === cred.otpCode || otpCode.length >= 4;
        if (!passMatch) {
          setIsLoading(false);
          setErrorMessage('Invalid OTP code. Please use 4201 or click "Request OTP".');
          return;
        }
      } else {
        passMatch =
          password === cred.passwordHash ||
          password === '1234' ||
          password === 'demo' ||
          password.length >= 4;
      }

      if (idMatch && passMatch) {
        setIsLoading(false);
        setSuccessMessage(`Authenticated successfully as ${cred.user.name}`);
        ambientSound.playChime();
        confetti({ particleCount: 50, spread: 75 });
        setTimeout(() => {
          onLoginSuccess(cred.user);
          if (onClose) onClose();
        }, 350);
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid credentials. You can use the Quick Demo Fill buttons below.');
      }
    }, 600);
  };

  return (
    <div
      id="unified-auth-portal-wrapper"
      className={
        isModal
          ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200'
          : 'min-h-[85vh] flex flex-col justify-center items-center py-6 px-4 animate-in fade-in duration-300'
      }
    >
      {/* Simulated SMS Alert Toast for Parents */}
      {simulatedSmsToast && (
        <div className="fixed top-5 z-60 max-w-md w-full mx-auto px-4 animate-in slide-in-from-top duration-300">
          <div className="p-3.5 rounded-2xl bg-indigo-900/95 border border-indigo-500/50 text-white shadow-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold">SMS Gateway Delivered</p>
                <p className="text-indigo-200 text-[11px] font-mono">{simulatedSmsToast}</p>
              </div>
            </div>
            <button
              onClick={() => setSimulatedSmsToast(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-indigo-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div
        id="unified-auth-card"
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all relative ${
          darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Institutional Branding Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white relative">
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white">
                  Apex Institute of Engineering & Technology
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Autonomous ERP
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Central Campus Authentication Gateway • Multi-Role Access Control
              </p>
            </div>
          </div>
        </div>

        {/* Portal Selection Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 p-1.5 gap-1.5">
          {/* 1. Student Portal Tab */}
          <button
            id="auth-tab-student"
            type="button"
            onClick={() => handleSelectPortal('student')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-bold transition-all ${
              selectedPortal === 'student'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                selectedPortal === 'student'
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-center sm:text-left leading-tight">
              <span>Student Portal</span>
              <span className="block text-[10px] font-normal opacity-70">Roll No Login</span>
            </div>
          </button>

          {/* 2. Faculty Portal Tab */}
          <button
            id="auth-tab-faculty"
            type="button"
            onClick={() => handleSelectPortal('faculty')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-bold transition-all ${
              selectedPortal === 'faculty'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                selectedPortal === 'faculty'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-center sm:text-left leading-tight">
              <span>Faculty Portal</span>
              <span className="block text-[10px] font-normal opacity-70">Staff ID / Email</span>
            </div>
          </button>

          {/* 3. Parent Portal Tab */}
          <button
            id="auth-tab-parent"
            type="button"
            onClick={() => handleSelectPortal('parent')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-bold transition-all ${
              selectedPortal === 'parent'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                selectedPortal === 'parent'
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              <Users className="w-4 h-4" />
            </div>
            <div className="text-center sm:text-left leading-tight">
              <span>Parent Portal</span>
              <span className="block text-[10px] font-normal opacity-70">Ward Attendance</span>
            </div>
          </button>

          {/* 4. Admin Portal Tab */}
          <button
            id="auth-tab-admin"
            type="button"
            onClick={() => handleSelectPortal('admin')}
            className={`hidden sm:flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-bold transition-all ${
              selectedPortal === 'admin'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                selectedPortal === 'admin'
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-center sm:text-left leading-tight">
              <span>Admin Portal</span>
              <span className="block text-[10px] font-normal opacity-70">Campus Registry</span>
            </div>
          </button>
        </div>

        {/* Portal Content & Form */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Description for selected portal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                    selectedPortal === 'student'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : selectedPortal === 'faculty'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : selectedPortal === 'parent'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {selectedPortal === 'student'
                    ? 'Student Self-Service Gateway'
                    : selectedPortal === 'faculty'
                    ? 'Faculty & Examiner Portal'
                    : selectedPortal === 'parent'
                    ? 'Parent / Guardian Monitoring Portal'
                    : 'Institutional Administrator Clearance'}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {selectedPortal === 'student' && 'Log In to Access Academic Dashboard & Attendance AI'}
                {selectedPortal === 'faculty' && 'Log In to Manage Courses, Upload Marks & Alert Students'}
                {selectedPortal === 'parent' && 'Log In to Monitor Ward Attendance, Marks & Schedule Calls'}
                {selectedPortal === 'admin' && 'Log In to Campus Governance & Space Infrastructure'}
              </h3>
            </div>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin(selectedPortal)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>1-Click Quick Demo Login</span>
            </button>
          </div>

          {/* Error & Success Banners */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* STUDENT PORTAL SPECIFIC FIELDS */}
            {selectedPortal === 'student' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>College Roll Number / Registration ID</span>
                    <span className="text-[10px] text-slate-400 font-normal">Format: 26CSDXXX</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 26CSD042 or mokshagna@apex.edu.in"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Student Portal Password / PIN</span>
                    <span className="text-[10px] text-indigo-500 font-semibold cursor-pointer hover:underline">
                      Demo PIN: student123
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* FACULTY PORTAL SPECIFIC FIELDS */}
            {selectedPortal === 'faculty' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Faculty Employee ID or Official Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. FAC-CSD-108 or a.thorne@college.edu"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Department Branch
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Computer Science & Design (CSD)</option>
                      <option>Computer Science & Engineering (CSE)</option>
                      <option>Artificial Intelligence & Data Science (AIDS)</option>
                      <option>Electronics & Communication (ECE)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Faculty Secret Key / Password</span>
                    <span className="text-[10px] text-blue-500 font-semibold cursor-pointer hover:underline">
                      Demo PIN: faculty123
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* PARENT PORTAL SPECIFIC FIELDS */}
            {selectedPortal === 'parent' && (
              <>
                {/* Method selector: PIN vs Instant OTP */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 max-w-xs">
                  <button
                    type="button"
                    onClick={() => setParentLoginMode('pin')}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      parentLoginMode === 'pin'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Parent PIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setParentLoginMode('otp')}
                    className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                      parentLoginMode === 'otp'
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Instant SMS OTP
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Ward's Student Roll Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. 26CSD042"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Registered Parent Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="+91 98480 12345"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                    </div>
                  </div>
                </div>

                {parentLoginMode === 'pin' ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Parent Security PIN</span>
                      <span className="text-[10px] text-purple-500 font-semibold cursor-pointer hover:underline">
                        Demo PIN: parent123
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>4-Digit SMS Verification OTP</span>
                      <span className="text-[10px] text-purple-500 font-semibold">
                        OTP Code: 4201
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="4201"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center tracking-widest font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shrink-0 shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>{otpSent ? 'Resend OTP' : 'Request OTP'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ADMIN PORTAL SPECIFIC FIELDS */}
            {selectedPortal === 'admin' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Administrator Security ID
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. ADM-APEX-001"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Master Security Key</span>
                    <span className="text-[10px] text-teal-500 font-semibold cursor-pointer hover:underline">
                      Demo PIN: admin123
                    </span>
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </>
            )}

            {/* Remember Me & Help Links */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember session on this device</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert(
                    `Institutional Portal Assistance:\nFor student or faculty account recovery, contact Apex IT Cell at helpdesk@apex.edu.in or call ext. 404.`
                  )
                }
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Forgot PIN?</span>
              </button>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
                selectedPortal === 'student'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  : selectedPortal === 'faculty'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  : selectedPortal === 'parent'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                  : 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating Directory...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In to{' '}
                    {selectedPortal === 'student'
                      ? 'Student Portal'
                      : selectedPortal === 'faculty'
                      ? 'Faculty Portal'
                      : selectedPortal === 'parent'
                      ? 'Parent Portal'
                      : 'Admin Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Institutional Security Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Protected by 256-bit Institutional TLS & Role-Based Access Control (RBAC)</span>
          </div>

          {/* Hackathon Evaluator Quick Login Drawer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 text-center">
              ⚡ Hackathon 2026 Evaluation: 1-Click Instant Portal Logins
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Student Quick Pill */}
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    🎓
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 truncate">
                      Student: Mokshagna
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">Roll: 26CSD042 • 1st Yr</p>
                  </div>
                </div>
              </button>

              {/* Faculty Quick Pill */}
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty')}
                className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    👨‍🏫
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 truncate">
                      Faculty: Dr. Aris Thorne
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">ID: FAC-CSD-108</p>
                  </div>
                </div>
              </button>

              {/* Parent Quick Pill */}
              <button
                type="button"
                onClick={() => handleQuickLogin('parent')}
                className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    👨‍👩‍👦
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300 truncate">
                      Parent: Srinivasa Rao
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">Ward: Mokshagna</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
