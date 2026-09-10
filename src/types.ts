export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type UserRole = 'student' | 'parent' | 'faculty' | 'admin';

export interface SubjectData {
  id: string;
  code: string;
  name: string;
  shortName: string;
  faculty: string;
  facultyEmail: string;
  facultyRoom: string;
  credits: number;
  classesConducted: number;
  classesAttended: number;
  attendancePct: number;
  internalMarks: number;
  maxInternalMarks: number;
  nextExamDate: string;
  nextExamName: string;
  daysToExam: number;
  syllabusTopics: string[];
  weakTopics: string[];
  difficulty: 'High' | 'Medium' | 'Low';
  status: 'Strong' | 'Good' | 'Moderate' | 'Needs Improvement';
}

export interface DailyTask {
  id: string;
  title: string;
  subject?: string;
  priority: PriorityLevel;
  estimatedTime: string;
  estimatedMinutes: number;
  deadline: string;
  reason: string;
  completed: boolean;
  actionTag?: 'attendance' | 'assignment' | 'exam' | 'study' | 'free_period';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  deadline: string;
  daysRemaining: number;
  estimatedMinutes: number;
  estimatedTime: string;
  difficulty: 'Hard' | 'Medium' | 'Easy';
  examProximity: 'High' | 'Medium' | 'Low';
  priority: PriorityLevel;
  priorityScore: number;
  status: 'pending' | 'in_progress' | 'submitted';
  description: string;
  faculty: string;
  maxMarks: number;
}

export interface ExamInfo {
  id: string;
  subject: string;
  code: string;
  examType: string;
  date: string;
  time: string;
  venue: string;
  daysRemaining: number;
  hoursRemaining: number;
  syllabusWeight: string;
  prepProgressPct: number;
  keyTopics: string[];
}

export interface TimetablePeriod {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  subject: string;
  code?: string;
  room: string;
  faculty: string;
  isFreePeriod?: boolean;
  freeDuration?: string;
  suggestedAction?: string;
}

export interface CollegeNotice {
  id: string;
  title: string;
  category: 'Academic' | 'Examination' | 'Event' | 'Administrative';
  date: string;
  urgency: 'urgent' | 'important' | 'info';
  content: string;
  publishedBy: string;
  actionable?: {
    examDate?: string;
    daysRemaining?: number;
    subject?: string;
    prepStatus?: number;
    actionLabel: string;
    checklist?: string[];
  };
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'Classroom' | 'Laboratory' | 'Library' | 'Food' | 'Administration' | 'Auditorium' | 'Sports';
  building: string;
  floor: string;
  roomNumber: string;
  directions: string;
  distanceTime: string;
  inCharge?: string;
  operatingHours?: string;
}

export interface EmptyRoomInfo {
  id: string;
  roomNumber: string;
  building: string;
  floor: string;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  currentClass?: string;
  freeUntil: string;
  features: string[];
}

export interface AcademicHealthBreakdown {
  score: number;
  status: 'Excellent' | 'Good' | 'Attention Needed' | 'Critical';
  summary: string;
  factors: {
    attendance: { score: number; weight: number; comment: string };
    internalMarks: { score: number; weight: number; comment: string };
    assignments: { score: number; weight: number; comment: string };
    upcomingExams: { score: number; weight: number; comment: string };
    studyProgress: { score: number; weight: number; comment: string };
  };
}

export interface DigitalTwinState {
  attendanceStatus: 'Good' | 'Moderate' | 'Critical';
  marksStatus: 'Good' | 'Moderate' | 'Needs Improvement';
  assignmentsStatus: 'Good' | 'Pending Pressure' | 'Behind';
  examPrepStatus: 'Needs Attention' | 'On Track' | 'Critical';
  predictedSgpa: number;
  predictedAttendanceRiskSubjects: string[];
  aiPredictionText: string;
  aiRecommendationText: string;
  habitsSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  sourceContext?: string;
  suggestedQuestions?: string[];
}

export interface DigitalTwinSimulation {
  currentTrajectory: {
    prediction: string;
    predictedSGPA: number;
    riskLevel: string;
  };
  recommendedTrajectory: {
    recommendation: string;
    predictedSGPA: number;
    targetAchieved: boolean;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  identifier: string; // Roll No, Faculty ID, or Parent Phone
  department?: string;
  avatar: string;
  title?: string;
  additionalInfo?: string;
  wardName?: string;
  wardRollNumber?: string;
  relationship?: string;
  lastLogin?: string;
}

// Aliases for convenience
export type Notice = CollegeNotice;
export type TimetableSlot = TimetablePeriod;
export type EmptyRoom = EmptyRoomInfo;
