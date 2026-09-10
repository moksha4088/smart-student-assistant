import {
  SubjectData,
  Assignment,
  ExamInfo,
  AcademicHealthBreakdown,
  DigitalTwinState,
  DigitalTwinSimulation,
  DailyTask,
} from '../types';

export function calculateAcademicHealth(
  subjects: SubjectData[],
  assignments: Assignment[],
  exams: ExamInfo[],
  dailyTasksOrCompleted: number | DailyTask[],
  totalDailyTasksParam?: number
): AcademicHealthBreakdown {
  let dailyTasksCompleted = 0;
  let totalDailyTasks = 5;

  if (Array.isArray(dailyTasksOrCompleted)) {
    dailyTasksCompleted = dailyTasksOrCompleted.filter((t) => t.completed).length;
    totalDailyTasks = Math.max(1, dailyTasksOrCompleted.length);
  } else {
    dailyTasksCompleted = typeof dailyTasksOrCompleted === 'number' ? dailyTasksOrCompleted : 0;
    totalDailyTasks = totalDailyTasksParam || 5;
  }
  // 1. Attendance score (Average attendance % across all subjects)
  const avgAttendance = subjects.reduce((sum, s) => sum + s.attendancePct, 0) / subjects.length;
  // Penalty for subjects below 75%
  const subBelow75 = subjects.filter((s) => s.attendancePct < 75).length;
  const attendanceScore = Math.max(20, Math.min(100, Math.round(avgAttendance - subBelow75 * 4)));

  // 2. Internal marks score
  const avgInternalsPct =
    subjects.reduce((sum, s) => sum + (s.internalMarks / s.maxInternalMarks) * 100, 0) / subjects.length;
  const internalMarksScore = Math.round(avgInternalsPct);

  // 3. Assignment completion score
  const submittedCount = assignments.filter((a) => a.status === 'submitted').length;
  const inProgressCount = assignments.filter((a) => a.status === 'in_progress').length;
  const assignmentScore = assignments.length > 0
    ? Math.round(((submittedCount * 1.0 + inProgressCount * 0.5) / assignments.length) * 100)
    : 85;

  // 4. Exam readiness factor (average prep progress weighted by urgency)
  const avgExamPrep = exams.reduce((sum, e) => sum + e.prepProgressPct, 0) / Math.max(1, exams.length);
  const examReadinessScore = Math.round(avgExamPrep * 1.1);

  // 5. Daily study task execution
  const taskRatio = totalDailyTasks > 0 ? dailyTasksCompleted / totalDailyTasks : 0.5;
  const studyProgressScore = Math.round(60 + taskRatio * 40);

  // Composite Calculation (Attendance 30%, Internals 30%, Assignments 15%, Exams 15%, Study 10%)
  const rawScore =
    attendanceScore * 0.30 +
    internalMarksScore * 0.30 +
    assignmentScore * 0.15 +
    examReadinessScore * 0.15 +
    studyProgressScore * 0.10;

  const score = Math.min(99, Math.max(40, Math.round(rawScore)));

  let status: 'Excellent' | 'Good' | 'Attention Needed' | 'Critical' = 'Good';
  if (score >= 85) status = 'Excellent';
  else if (score >= 70) status = 'Good';
  else if (score >= 55) status = 'Attention Needed';
  else status = 'Critical';

  // Find lowest subject
  const sortedByMarks = [...subjects].sort((a, b) => a.internalMarks - b.internalMarks);
  const lowestSubject = sortedByMarks[0];
  const imminentExam = [...exams].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];

  const summary = `Your academic performance is good, but ${lowestSubject.name} attendance (${lowestSubject.attendancePct}%) and the upcoming ${imminentExam.subject} exam need attention.`;

  return {
    score,
    status,
    summary,
    factors: {
      attendance: {
        score: attendanceScore,
        weight: 30,
        comment: `${subBelow75} subject(s) below mandatory 75% threshold (Math 58%, Java 72%).`,
      },
      internalMarks: {
        score: internalMarksScore,
        weight: 30,
        comment: `Average internals at ${internalMarksScore}%. Strongest in English (90%), weakest in Math (58%).`,
      },
      assignments: {
        score: assignmentScore,
        weight: 15,
        comment: `High priority Data Structures assignment due tomorrow (6 PM).`,
      },
      upcomingExams: {
        score: examReadinessScore,
        weight: 15,
        comment: `${imminentExam.subject} exam in ${imminentExam.daysRemaining} days. Current prep: ${imminentExam.prepProgressPct}%.`,
      },
      studyProgress: {
        score: studyProgressScore,
        weight: 10,
        comment: `Completed ${dailyTasksCompleted}/${totalDailyTasks} priority goals today. 4-day study streak active.`,
      },
    },
  };
}

export interface AttendanceSimulationResult {
  currentPct: number;
  attended: number;
  conducted: number;
  requiredPct: number;
  missSimulations: {
    missCount: number;
    newPct: number;
    isSafe: boolean;
    dropPct: number;
  }[];
  consecutiveClassesNeeded: number;
  safeToMissCount: number;
  projectionCurve: {
    label: string;
    scenario: string;
    percentage: number;
    threshold: number;
  }[];
}

export function simulateAttendance(
  subject: SubjectData,
  requiredPct: number = 75
): AttendanceSimulationResult {
  const { classesAttended: attended, classesConducted: conducted } = subject;
  const currentPct = Number(((attended / conducted) * 100).toFixed(1));

  // Calculate impact of missing 1, 2, 3, 4, 5 classes
  const missSimulations = [1, 2, 3, 4, 5].map((missCount) => {
    const newConducted = conducted + missCount;
    const newPct = Number(((attended / newConducted) * 100).toFixed(1));
    const dropPct = Number((currentPct - newPct).toFixed(1));
    return {
      missCount,
      newPct,
      isSafe: newPct >= requiredPct,
      dropPct,
    };
  });

  // How many consecutive classes needed to reach requiredPct?
  // (attended + x) / (conducted + x) >= requiredPct / 100
  let consecutiveClassesNeeded = 0;
  if (currentPct < requiredPct) {
    const targetFraction = requiredPct / 100;
    const numerator = targetFraction * conducted - attended;
    const denominator = 1 - targetFraction;
    consecutiveClassesNeeded = Math.max(0, Math.ceil(numerator / denominator));
  }

  // How many can safely be skipped without dropping below requiredPct?
  // attended / (conducted + s) >= requiredPct / 100
  let safeToMissCount = 0;
  if (currentPct >= requiredPct) {
    const targetFraction = requiredPct / 100;
    safeToMissCount = Math.max(0, Math.floor(attended / targetFraction - conducted));
  }

  // Projection curve data points for charting
  const projectionCurve: {
    label: string;
    scenario: string;
    percentage: number;
    threshold: number;
  }[] = [];

  // Miss scenarios (-3 to -1)
  for (let m = 3; m >= 1; m--) {
    const p = Number(((attended / (conducted + m)) * 100).toFixed(1));
    projectionCurve.push({
      label: `Miss ${m}`,
      scenario: `Miss ${m} classes`,
      percentage: p,
      threshold: requiredPct,
    });
  }

  // Current
  projectionCurve.push({
    label: 'Now',
    scenario: 'Current State',
    percentage: currentPct,
    threshold: requiredPct,
  });

  // Attend scenarios (+1 to +6)
  const steps = [1, 2, 4, 6, 8, 10];
  for (const a of steps) {
    const p = Number((((attended + a) / (conducted + a)) * 100).toFixed(1));
    projectionCurve.push({
      label: `+${a}`,
      scenario: `Attend next ${a} classes`,
      percentage: p,
      threshold: requiredPct,
    });
  }

  return {
    currentPct,
    attended,
    conducted,
    requiredPct,
    missSimulations,
    consecutiveClassesNeeded,
    safeToMissCount,
    projectionCurve,
  };
}

export function calculateCGPATarget(
  currentCGPA: number,
  targetCGPA: number,
  previousSemesters: number = 0,
  currentSemesterCredits: number = 20
) {
  // Assuming student is in Semester 1 (so target SGPA for Sem 1 directly equals target CGPA)
  const totalCompletedCredits = previousSemesters * 20;
  const targetSGPA =
    previousSemesters === 0
      ? targetCGPA
      : ((targetCGPA * (totalCompletedCredits + currentSemesterCredits)) -
          (currentCGPA * totalCompletedCredits)) /
        currentSemesterCredits;

  return {
    currentCGPA,
    targetCGPA,
    requiredSGPA: Number(Math.min(10, Math.max(0, targetSGPA)).toFixed(2)),
    isAchievable: targetSGPA <= 10.0,
    creditTotal: currentSemesterCredits,
  };
}

export const GRADE_POINTS: Record<string, number> = {
  'O (Outstanding)': 10,
  'A+ (Excellent)': 9,
  'A (Very Good)': 8,
  'B+ (Good)': 7,
  'B (Above Average)': 6,
  'C (Average)': 5,
};

export function calculateProjectedSGPA(
  subjects: { credits: number; gradePoint: number }[]
): number {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  if (totalCredits === 0) return 0;
  const weightedSum = subjects.reduce((sum, s) => sum + s.credits * s.gradePoint, 0);
  return Number((weightedSum / totalCredits).toFixed(2));
}

export function generateEmergencyExamPlan(
  daysRemaining: number,
  subjects: SubjectData[]
) {
  const sortedSubjects = [...subjects].sort((a, b) => {
    // Sort by exam urgency first, then lowest internal marks
    if (a.daysToExam !== b.daysToExam) return a.daysToExam - b.daysToExam;
    return a.internalMarks - b.internalMarks;
  });

  const planDays = Math.min(daysRemaining, 5);
  const schedule: {
    day: number;
    title: string;
    focusTheme: string;
    sessions: {
      time: string;
      subject: string;
      topic: string;
      priority: 'high' | 'critical' | 'medium';
      durationMinutes: number;
    }[];
  }[] = [];

  const ds = sortedSubjects.find((s) => s.id === 'subj-ds') || sortedSubjects[0];
  const math = sortedSubjects.find((s) => s.id === 'subj-math') || sortedSubjects[1];
  const java = sortedSubjects.find((s) => s.id === 'subj-java') || sortedSubjects[2];

  schedule.push({
    day: 1,
    title: 'Day 1: Foundation & High-Yield Weakness Attack',
    focusTheme: 'Tackle the 2 hardest concepts first before fatigue sets in.',
    sessions: [
      { time: '09:00 AM - 10:30 AM', subject: ds.name, topic: 'AVL Trees — Left & Right Rotations with balance factor calculations', priority: 'critical', durationMinutes: 90 },
      { time: '11:00 AM - 12:30 PM', subject: math.name, topic: 'Integration by Parts & Trigonometric Substitutions', priority: 'critical', durationMinutes: 90 },
      { time: '02:00 PM - 03:30 PM', subject: java.name, topic: 'Exception Handling & Custom Checked/Unchecked Hierarchies', priority: 'high', durationMinutes: 90 },
      { time: '04:30 PM - 05:30 PM', subject: ds.name, topic: 'Problem set: 5 AVL Tree insertions dry-run on paper', priority: 'medium', durationMinutes: 60 },
    ],
  });

  schedule.push({
    day: 2,
    title: 'Day 2: Advanced Data Structures & Math Core Equations',
    focusTheme: 'Master multi-way search trees and differential equations.',
    sessions: [
      { time: '09:00 AM - 10:30 AM', subject: ds.name, topic: 'B-Trees & B+ Trees — Insertion, Splitting, and Height bounds', priority: 'critical', durationMinutes: 90 },
      { time: '11:00 AM - 12:30 PM', subject: math.name, topic: 'First Order Differential Equations & Integrating Factor method', priority: 'critical', durationMinutes: 90 },
      { time: '02:00 PM - 03:30 PM', subject: java.name, topic: 'Multithreading — Runnable, Thread lifecycle, and Synchronized blocks', priority: 'high', durationMinutes: 90 },
      { time: '04:30 PM - 05:30 PM', subject: ds.name, topic: 'Hash Tables & Open Addressing collision resolution algorithms', priority: 'medium', durationMinutes: 60 },
    ],
  });

  schedule.push({
    day: 3,
    title: 'Day 3: Mid-Point Consolidation & Speed Solving',
    focusTheme: 'Timed past paper practice and key definition recall.',
    sessions: [
      { time: '09:00 AM - 10:30 AM', subject: ds.name, topic: 'Graph Traversals — BFS vs DFS recursive implementation and time complexity', priority: 'critical', durationMinutes: 90 },
      { time: '11:00 AM - 12:30 PM', subject: math.name, topic: 'Multiple Integrals — Double integrals in Cartesian & Polar coordinates', priority: 'critical', durationMinutes: 90 },
      { time: '02:00 PM - 03:30 PM', subject: java.name, topic: 'Collections Framework — ArrayList vs LinkedList vs HashMap internal mechanics', priority: 'high', durationMinutes: 90 },
      { time: '04:30 PM - 05:30 PM', subject: ds.name, topic: 'Heap Sort & Priority Queue operations', priority: 'medium', durationMinutes: 60 },
    ],
  });

  schedule.push({
    day: 4,
    title: 'Day 4: Exam Simulation & Formula Cheat Sheet',
    focusTheme: 'Simulate full 2-hour Data Structures exam conditions.',
    sessions: [
      { time: '09:00 AM - 11:00 AM', subject: ds.name, topic: 'Full Mock Exam Paper (2025 Mid-Term 1) in strict exam conditions', priority: 'critical', durationMinutes: 120 },
      { time: '11:30 AM - 12:45 PM', subject: ds.name, topic: 'Mock paper self-grading & review of skipped questions', priority: 'high', durationMinutes: 75 },
      { time: '02:00 PM - 03:30 PM', subject: math.name, topic: 'Linear Algebra — Eigenvalues, Eigenvectors, Cayley-Hamilton theorem', priority: 'high', durationMinutes: 90 },
      { time: '04:00 PM - 05:30 PM', subject: java.name, topic: 'Generics, Wildcards, and Interface polymorphism practice', priority: 'medium', durationMinutes: 90 },
    ],
  });

  schedule.push({
    day: 5,
    title: 'Day 5: Pre-Exam Triage & Rapid Formula Flashcards',
    focusTheme: 'Final high-confidence polish. No new heavy topics.',
    sessions: [
      { time: '09:00 AM - 10:30 AM', subject: ds.name, topic: 'Rapid formula & code snippet review: AVL rotations and B-Tree degree checks', priority: 'critical', durationMinutes: 90 },
      { time: '11:00 AM - 12:15 PM', subject: ds.name, topic: 'Important viva & 2-mark definitions flashcard drill', priority: 'high', durationMinutes: 75 },
      { time: '02:00 PM - 03:15 PM', subject: math.name, topic: 'Light formula consolidation & summary sheet review', priority: 'medium', durationMinutes: 75 },
      { time: '08:00 PM - 09:00 PM', subject: ds.name, topic: 'Mental walkthrough of exam hall strategy & early rest', priority: 'medium', durationMinutes: 60 },
    ],
  });

  return schedule.slice(0, planDays);
}

export function generateDigitalTwin(
  studyHoursOrSubjects: number | SubjectData[],
  attendanceOrAssignments?: number | Assignment[],
  subjectsOrExams?: SubjectData[] | ExamInfo[]
): any {
  if (typeof studyHoursOrSubjects === 'number') {
    const studyHours = studyHoursOrSubjects;
    const weeklyAtt = typeof attendanceOrAssignments === 'number' ? attendanceOrAssignments : 85;

    const baselineSgpa = Number((7.0 + studyHours * 0.28 + (weeklyAtt - 75) * 0.015).toFixed(2));
    const optimizedSgpa = Number((baselineSgpa + 0.76).toFixed(2));

    return {
      currentTrajectory: {
        prediction: `At ${studyHours} hours of daily study and ${weeklyAtt}% projected attendance, you are on track for an SGPA of ~${baselineSgpa}. Mathematics remains vulnerable to low internal scoring without dedicated problem-solving blocks.`,
        predictedSGPA: Math.min(10, baselineSgpa),
        riskLevel: weeklyAtt < 75 ? 'Critical (Below 75%)' : weeklyAtt < 80 ? 'Moderate (Close to limit)' : 'Low Risk',
      },
      recommendedTrajectory: {
        recommendation: `Increasing daily study to 2.5 hours focused on differential equations and maintaining 95%+ attendance across all 6 courses elevates your trajectory to an SGPA of ~${optimizedSgpa}, comfortably surpassing your 8.0 target.`,
        predictedSGPA: Math.min(10, Math.max(8.0, optimizedSgpa)),
        targetAchieved: optimizedSgpa >= 8.0,
      },
    };
  }

  const subjects = studyHoursOrSubjects as SubjectData[];
  const assignments = (attendanceOrAssignments || []) as Assignment[];
  const exams = (subjectsOrExams || []) as ExamInfo[];

  const avgAtt = subjects.reduce((sum, s) => sum + s.attendancePct, 0) / subjects.length;
  const avgMarks = subjects.reduce((sum, s) => sum + (s.internalMarks / s.maxInternalMarks) * 100, 0) / subjects.length;
  const riskSubjects = subjects.filter((s) => s.attendancePct < 75).map((s) => s.shortName);

  const pendingUrgentAsg = assignments.filter((a) => a.status !== 'submitted' && a.daysRemaining <= 2).length;
  const nearestExam = [...exams].sort((a, b) => a.daysRemaining - b.daysRemaining)[0] || { prepProgressPct: 45 };

  const attendanceStatus: 'Good' | 'Moderate' | 'Critical' =
    avgAtt >= 78 ? 'Good' : avgAtt >= 68 ? 'Moderate' : 'Critical';

  const marksStatus: 'Good' | 'Moderate' | 'Needs Improvement' =
    avgMarks >= 75 ? 'Good' : avgMarks >= 65 ? 'Moderate' : 'Needs Improvement';

  const assignmentsStatus: 'Good' | 'Pending Pressure' | 'Behind' =
    pendingUrgentAsg === 0 ? 'Good' : pendingUrgentAsg <= 2 ? 'Pending Pressure' : 'Behind';

  const examPrepStatus: 'Needs Attention' | 'On Track' | 'Critical' =
    nearestExam.prepProgressPct < 50 ? 'Needs Attention' : 'On Track';

  const predictedSgpa = Number((avgMarks / 10 + (avgAtt >= 75 ? 0.2 : -0.3)).toFixed(2));

  const aiPredictionText =
    `If your current study pattern continues, your expected academic performance will yield an SGPA of ~${predictedSgpa} (approx CGPA 7.42). While your programming skills are solid, Mathematics attendance (58%) risks a condonation barrier.`;

  const aiRecommendationText =
    `Increase Mathematics study time by 30 minutes per day and complete the pending Data Structures assignment before 6 PM. Attending the next 6 consecutive Java classes will safely lift your attendance over 75%.`;

  return {
    attendanceStatus,
    marksStatus,
    assignmentsStatus,
    examPrepStatus,
    predictedSgpa,
    predictedAttendanceRiskSubjects: riskSubjects,
    aiPredictionText,
    aiRecommendationText,
    habitsSummary: 'Prefers late evening study sessions; strong in practical coding but tends to defer pure theoretical mathematics until 4 days before exams.',
  };
}

