import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Flame,
} from 'lucide-react';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
  darkMode: boolean;
}

const DEMO_STEPS = [
  {
    step: 1,
    title: '1. Student Command Center & Academic Health',
    tab: 'dashboard',
    badge: 'COLLECT & UNDERSTAND',
    description:
      'Mokshagna opens his Command Center. At a glance, he sees his overall Academic Health Score: 78/100. Instead of just raw numbers, AI gives him an instant summary: "Your academic performance is good, but Mathematics attendance and the upcoming Data Structures exam need attention."',
    actionLabel: 'Go to Command Center',
  },
  {
    step: 2,
    title: '2. "What should I do today?" AI Prioritizer',
    tab: 'dashboard',
    badge: 'RECOMMEND & ACT',
    description:
      'Rather than wondering where to start, AI presents a ranked agenda: 1) Attend Java class (72% attendance margin), 2) Submit Data Structures AVL assignment before 6 PM, 3) Study Math double integrals, 4) Revise AVL trees. Student can mark tasks complete or launch Pomodoro focus sessions directly.',
    actionLabel: 'Inspect AI Daily Tasks',
  },
  {
    step: 3,
    title: '3. "Can I Miss This Class?" Decision Simulator',
    tab: 'attendance',
    badge: 'PREDICT & PREVENT',
    description:
      'Considering skipping Java? The interactive simulator reveals the exact mathematical cost: Missing 1 class drops attendance to 70.59% (-1.4%), breaching the 75% college mandate. The engine calculates: "You must attend 6 consecutive lectures to safely recover 75%!"',
    actionLabel: 'Simulate Java Attendance',
  },
  {
    step: 4,
    title: '4. "Where Am I Weak?" & Academic Digital Twin',
    tab: 'academics',
    badge: 'TARGET & SIMULATE',
    description:
      'Mokshagna plans how to reach his target 8.0 CGPA from 7.2. The AI Academic Digital Twin simulates his future: His current 1.5 hr/day study habit predicts 7.42 SGPA; switching to the AI Recommended 2.5 hrs/day achieves 8.18 SGPA with zero attendance risk.',
    actionLabel: 'Open CGPA & Digital Twin',
  },
  {
    step: 5,
    title: '5. "Exam Survival Mode" (Emergency Plan)',
    tab: 'study-planner',
    badge: 'EMERGENCY AI',
    description:
      'With Mid-Terms in 4 days, Mokshagna toggles Exam Survival Mode. The engine schedules a 5-day structured revision plan balancing high-weight Data Structures topics (AVL Trees, B Trees) with built-in Pomodoro focus blocks and synthesized focus audio.',
    actionLabel: 'View Exam Survival Mode',
  },
  {
    step: 6,
    title: '6. Smart Assignment Prioritizer',
    tab: 'assignments',
    badge: 'WORKFLOW AI',
    description:
      'Instead of a flat chronological list, assignments are scored by Deadline Urgency + Difficulty + Exam Proximity. Data Structures AVL Trees is ranked #1 Critical Priority, while the low-weight English essay is safely scheduled later.',
    actionLabel: 'View Assignment Priority',
  },
  {
    step: 7,
    title: '7. Find Empty Classroom & Study Space',
    tab: 'campus',
    badge: 'CAMPUS FACILITIES',
    description:
      'During his 1 hour 20 minute free period, Mokshagna needs a quiet study room. The Campus Navigator instantly reveals Room 204 in Tech Block A is Available for the next 2 hours 10 minutes with air conditioning and Wi-Fi.',
    actionLabel: 'Find Empty Room 204',
  },
  {
    step: 8,
    title: '8. "Ask My College" AI Assistant',
    tab: 'ai-assistant',
    badge: 'GROUNDED CHATBOT',
    description:
      'Mokshagna asks: "Do I have a class at 10 AM?" or "Where is the computer lab?". The AI chatbot answers with 100% fidelity to the official college database. Strict guardrails guarantee it never hallucinates fictional dates or faculty.',
    actionLabel: 'Ask AI Chatbot',
  },
];

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  darkMode,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigateToTab(DEMO_STEPS[nextIdx].tab);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateToTab(DEMO_STEPS[prevIdx].tab);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    onNavigateToTab(DEMO_STEPS[index].tab);
  };

  return (
    <div
      id="hackathon-demo-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Hackathon 2026 Judge Walkthrough
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                  Step {currentStep.step} of {DEMO_STEPS.length}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Live demonstration of the core workflow: COLLECT → UNDERSTAND → PREDICT → RECOMMEND → ACT
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleJumpToStep(idx)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                currentStepIndex === idx
                  ? 'bg-indigo-600 text-white scale-110 shadow-xs'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {idx < currentStepIndex ? '✓' : s.step}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {currentStep.badge}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              Target Tab: <strong>{currentStep.tab}</strong>
            </span>
          </div>

          <h4 className="text-lg font-bold tracking-tight">
            {currentStep.title}
          </h4>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Clicking below automatically routes the app to this live view:
            </span>
            <button
              onClick={() => {
                onNavigateToTab(currentStep.tab);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>{currentStep.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === DEMO_STEPS.length - 1}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Next Scenario Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
