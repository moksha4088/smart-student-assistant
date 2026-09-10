import React, { useState } from 'react';
import {
  GraduationCap,
  Target,
  Sparkles,
  TrendingUp,
  Brain,
  Sliders,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { SubjectData } from '../types';
import { STUDENT_PROFILE } from '../data/collegeDatabase';
import { generateDigitalTwin } from '../utils/academicEngine';

interface CGPAPlannerProps {
  subjects: SubjectData[];
  darkMode: boolean;
}

const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
};

export const CGPAPlanner: React.FC<CGPAPlannerProps> = ({ subjects, darkMode }) => {
  // Target CGPA
  const [targetCGPA, setTargetCGPA] = useState<number>(8.0);

  // Projected grades for each subject in current semester
  const [subjectGrades, setSubjectGrades] = useState<Record<string, string>>({
    'subj-ds': 'A+',
    'subj-java': 'A',
    'subj-math': 'B+',
    'subj-phy': 'B+',
    'subj-chem': 'A',
    'subj-eng': 'O',
  });

  // Digital Twin interactive simulation state
  const [simStudyHours, setSimStudyHours] = useState<number>(1.5);
  const [simWeeklyAttendancePct, setSimWeeklyAttendancePct] = useState<number>(85);

  const digitalTwin = generateDigitalTwin(simStudyHours, simWeeklyAttendancePct, subjects);

  // Calculate projected Semester 1 SGPA
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const earnedCreditPoints = subjects.reduce((sum, s) => {
    const grade = subjectGrades[s.id] || 'B';
    const points = GRADE_POINTS[grade] || 6;
    return sum + points * s.credits;
  }, 0);
  const projectedSGPA = Number((earnedCreditPoints / totalCredits).toFixed(2));

  // If Semester 1 is Mokshagna's first semester, CGPA = SGPA. If prior exists, weighted average.
  const projectedCGPA = projectedSGPA;
  const isTargetAchieved = projectedCGPA >= targetCGPA;

  const handleGradeChange = (subjectId: string, grade: string) => {
    setSubjectGrades((prev) => ({ ...prev, [subjectId]: grade }));
  };

  return (
    <div id="academics-cgpa-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-500" />
              Target My CGPA & Academic Twin
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Decision Planner
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate credit-weighted outcomes to achieve your goal: <strong>Current {STUDENT_PROFILE.currentCGPA} → Target {targetCGPA}</strong>
          </p>
        </div>

        {/* Target Slider */}
        <div
          className={`p-3 rounded-2xl border flex items-center gap-3 ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <Target className="w-4 h-4 text-indigo-500" />
          <div className="text-xs">
            <span className="text-slate-400 font-semibold">Goal CGPA:</span>{' '}
            <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{targetCGPA.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min="6.5"
            max="9.5"
            step="0.1"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(parseFloat(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Target Achievement Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Current CGPA</p>
            <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {STUDENT_PROFILE.currentCGPA}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Semester 1 in progress</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
            Sem 1
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <p className="text-xs uppercase font-bold text-slate-400">Projected SGPA</p>
            <p className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
              {projectedSGPA}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Total Credits: {totalCredits}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border flex items-center justify-between ${
            isTargetAchieved
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
          }`}
        >
          <div>
            <p className="text-xs uppercase font-bold text-slate-500">Target Result</p>
            <p
              className={`text-2xl font-black font-mono mt-1 ${
                isTargetAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isTargetAchieved ? 'Goal Achieved!' : `Needs +${(targetCGPA - projectedCGPA).toFixed(2)}`}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
              {isTargetAchieved
                ? `Projected ${projectedCGPA} meets target of ${targetCGPA}`
                : `Increase grades in 4-credit courses below`}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isTargetAchieved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {isTargetAchieved ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
        </div>
      </div>

      {/* Grade Simulator Grid */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Interactive Subject Grade Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Adjust expected grades. Notice higher credit subjects (4.0 Credits) exert the strongest mathematical leverage on your CGPA.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            Total Weight: {totalCredits} Credits
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => {
            const currentGrade = subjectGrades[s.id] || 'B';
            return (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {s.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {s.code} • {s.credits} Credits
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {GRADE_POINTS[currentGrade]} pts
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {['O', 'A+', 'A', 'B+', 'B', 'C'].map((g) => (
                    <button
                      key={g}
                      onClick={() => handleGradeChange(s.id, g)}
                      className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                        currentGrade === g
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UNIQUE FEATURE: STUDENT ACADEMIC DIGITAL TWIN */}
      <div
        id="digital-twin-section"
        className={`p-6 rounded-2xl border transition-all ${
          darkMode ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-900/40' : 'bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 border-indigo-100 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-indigo-200/40 dark:border-indigo-900/40">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500 animate-pulse" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                My Academic Digital Twin
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                Hackathon Innovation
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              An AI model reflecting Mokshagna's academic trajectory, simulating future semester results based on active study habits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400">Daily Study Simulation: </span>
              <strong className="text-indigo-600 dark:text-indigo-400">{simStudyHours} hrs/day</strong>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={simStudyHours}
                onChange={(e) => setSimStudyHours(parseFloat(e.target.value))}
                className="block w-28 accent-indigo-600 cursor-pointer mt-1"
              />
            </div>
            <div>
              <span className="text-slate-400">Class Attendance: </span>
              <strong className="text-indigo-600 dark:text-indigo-400">{simWeeklyAttendancePct}%</strong>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={simWeeklyAttendancePct}
                onChange={(e) => setSimWeeklyAttendancePct(parseInt(e.target.value))}
                className="block w-28 accent-indigo-600 cursor-pointer mt-1"
              />
            </div>
          </div>
        </div>

        {/* Digital Twin 2-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Column 1: "If your current study pattern continues..." */}
          <div
            className={`p-5 rounded-xl border ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Baseline Trajectory
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-bold">
                1.5 hrs/day
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              “If your current study pattern continues...”
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {digitalTwin.currentTrajectory.prediction}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Predicted SGPA</span>
                <p className="text-lg font-black font-mono text-slate-800 dark:text-slate-200">
                  {digitalTwin.currentTrajectory.predictedSGPA}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Attendance Risk</span>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">
                  {digitalTwin.currentTrajectory.riskLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: "AI Recommended Pattern" */}
          <div
            className={`p-5 rounded-xl border ${
              darkMode
                ? 'bg-indigo-950/20 border-indigo-800/50'
                : 'bg-indigo-50/50 border-indigo-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Optimized AI Trajectory
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold">
                2.5 hrs/day
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              “AI Recommended Pattern”
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {digitalTwin.recommendedTrajectory.recommendation}
            </p>

            <div className="mt-4 pt-3 border-t border-indigo-200/50 dark:border-indigo-900/50 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Optimized SGPA</span>
                <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {digitalTwin.recommendedTrajectory.predictedSGPA}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">Target 8.0 Status</span>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {digitalTwin.recommendedTrajectory.targetAchieved ? 'Exceeds Target (8.18)' : 'Close to Target'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
