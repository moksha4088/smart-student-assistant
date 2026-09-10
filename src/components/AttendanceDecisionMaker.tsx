import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Info,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { SubjectData } from '../types';
import { simulateAttendance } from '../utils/academicEngine';

interface AttendanceDecisionMakerProps {
  subjects: SubjectData[];
  darkMode: boolean;
}

export const AttendanceDecisionMaker: React.FC<AttendanceDecisionMakerProps> = ({
  subjects,
  darkMode,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj-java');
  const [simulatedMiss, setSimulatedMiss] = useState<number>(1);

  const selectedSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const simulation = simulateAttendance(selectedSubject, 75);

  const currentMissScenario = simulation.missSimulations.find(
    (m) => m.missCount === simulatedMiss
  ) || simulation.missSimulations[0];

  return (
    <div id="attendance-decision-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Concept Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-indigo-500" />
              AI Attendance Decision Maker
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Interactive Simulator
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Answer the vital question: <strong>“Can I miss this class?”</strong> Understand the mathematical consequences before you skip.
          </p>
        </div>

        {/* Official Disclaimer Badge */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0 text-amber-500" />
          <span className="text-[11px] font-medium leading-tight">
            <strong>Disclaimer:</strong> Planning estimate only. Not an official college attendance record.
          </span>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map((subj) => {
          const isSelected = subj.id === selectedSubject.id;
          const isSafe = subj.attendancePct >= 75;

          return (
            <button
              key={subj.id}
              id={`subject-tab-${subj.id}`}
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                  : darkMode
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{subj.shortName}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? 'bg-white/20 text-white font-bold'
                    : isSafe
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {subj.attendancePct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Simulation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulation Details & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status Card */}
          <div
            id="subject-status-card"
            className={`p-6 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>{selectedSubject.code}</span>
                  <span>•</span>
                  <span>{selectedSubject.faculty}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedSubject.name}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">Current Attendance</p>
                  <p
                    className={`text-2xl font-black font-mono leading-none mt-1 ${
                      selectedSubject.attendancePct >= 75
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {selectedSubject.attendancePct}%
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedSubject.attendancePct >= 75
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-rose-500/10 text-rose-600'
                  }`}
                >
                  {selectedSubject.attendancePct >= 75 ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
              </div>
            </div>

            {/* Attendance breakdown numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Classes Attended</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {selectedSubject.classesAttended}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Classes Conducted</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {selectedSubject.classesConducted}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Required Threshold</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  75.0%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Faculty & Room</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1">
                  {selectedSubject.facultyRoom}
                </p>
              </div>
            </div>

            {/* Interactive "What happens if I miss next X classes?" */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                    Simulate: “What happens if I miss classes?”
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select how many upcoming sessions you are considering missing:
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      id={`sim-miss-btn-${num}`}
                      onClick={() => setSimulatedMiss(num)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        simulatedMiss === num
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {num} {num === 1 ? 'class' : 'classes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Result Callout Box */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentMissScenario.isSafe
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg ${
                      currentMissScenario.isSafe ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {currentMissScenario.isSafe ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold">
                        If you miss the next {simulatedMiss} {simulatedMiss === 1 ? 'class' : 'classes'}:
                      </span>
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                          currentMissScenario.isSafe ? 'bg-emerald-200 dark:bg-emerald-900/60' : 'bg-rose-200 dark:bg-rose-900/60'
                        }`}
                      >
                        {selectedSubject.attendancePct}% → {currentMissScenario.newPct}%
                      </span>
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        (-{currentMissScenario.dropPct}%)
                      </span>
                    </div>

                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {currentMissScenario.isSafe ? (
                        <span>
                          <strong>Safe to miss:</strong> Your predicted attendance of <strong>{currentMissScenario.newPct}%</strong> remains above the required 75% college mandate.
                        </span>
                      ) : (
                        <span>
                          <strong>DO NOT SKIP:</strong> Missing {simulatedMiss} class(es) will drop your attendance to <strong>{currentMissScenario.newPct}%</strong>, which breaches the required 75% threshold and risks an official condonation notice or exam hall ticket block!
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Visual Trajectory Chart */}
          <div
            id="attendance-chart-card"
            className={`p-6 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  Attendance Projection Curve
                </h3>
                <p className="text-xs text-slate-500">
                  Simulated impact: Missing classes (left) vs Attending consecutive classes (right)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-medium">
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <span className="w-3 h-0.5 bg-indigo-600 inline-block rounded" />
                  Projected %
                </span>
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed inline-block" />
                  75% Required Limit
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulation.projectionCurve} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                  <XAxis
                    dataKey="label"
                    stroke={darkMode ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[40, 100]}
                    stroke={darkMode ? '#94a3b8' : '#64748b'}
                    fontSize={11}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      borderColor: darkMode ? '#334155' : '#e2e8f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Attendance']}
                    labelFormatter={(label) => `Scenario: ${label}`}
                  />
                  <ReferenceLine
                    y={75}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{ value: '75% Threshold', fill: '#ef4444', fontSize: 11, position: 'insideBottomRight' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Consecutive Classes Calculator & Strategy Card */}
        <div className="space-y-6">
          {/* Consecutive Classes Needed */}
          <div
            id="consecutive-classes-card"
            className={`p-6 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Recovery Target</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How Many Classes To Reach 75%?
            </h3>

            {simulation.consecutiveClassesNeeded > 0 ? (
              <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                <span className="text-xs font-semibold text-slate-500">You must attend</span>
                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight my-1">
                  {simulation.consecutiveClassesNeeded}
                </p>
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  consecutive classes
                </span>
                <p className="text-[11px] text-slate-500 mt-2">
                  Attending {simulation.consecutiveClassesNeeded} consecutive lectures will bring your record to{' '}
                  <strong>
                    {Math.round(
                      ((selectedSubject.classesAttended + simulation.consecutiveClassesNeeded) /
                        (selectedSubject.classesConducted + simulation.consecutiveClassesNeeded)) *
                        100
                    )}
                    %
                  </strong>
                  .
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Already in Safe Zone</span>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono my-1">
                  {selectedSubject.attendancePct}%
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You are currently <strong>+{selectedSubject.attendancePct - 75}%</strong> above the threshold!
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  You can safely miss up to <strong>{simulation.safeToMissCount}</strong> classes before dropping below 75%.
                </div>
              </div>
            )}

            {/* Exact Formula Breakdown */}
            <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300">Mathematical Formula:</p>
              <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
                (Attended + x) / (Conducted + x) ≥ 0.75
              </p>
              <p>
                For {selectedSubject.shortName}: ({selectedSubject.classesAttended} + x) / ({selectedSubject.classesConducted} + x) ≥ 0.75 → x = <strong>{simulation.consecutiveClassesNeeded}</strong>
              </p>
            </div>
          </div>

          {/* Quick All-Subject Risk Summary */}
          <div
            id="all-subjects-attendance-summary"
            className={`p-6 rounded-2xl border transition-all ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              All Subjects Risk Snapshot
            </h3>

            <div className="space-y-2.5">
              {subjects.map((s) => {
                const isUnder = s.attendancePct < 75;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSubjectId(s.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      s.id === selectedSubject.id
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{s.shortName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {s.classesAttended}/{s.classesConducted} attended
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold text-xs ${
                          isUnder ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {s.attendancePct}%
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {isUnder ? 'Below limit' : 'Safe margin'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
