import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { KNOWLEDGE_BASE_QA, STUDENT_PROFILE, SUBJECTS_DATA, EXAMS_LIST, INITIAL_ASSIGNMENTS, TIMETABLE_DATA, COLLEGE_NOTICES, CAMPUS_LOCATIONS, EMPTY_ROOMS } from './src/data/collegeDatabase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// College Database System Prompt
const COLLEGE_CONTEXT = `
You are the official "Ask My College" AI Assistant for Smart College Assistant at Apex Institute of Engineering & Technology.
Current Student: ${STUDENT_PROFILE.name}, Roll: ${STUDENT_PROFILE.rollNumber}, Department: ${STUDENT_PROFILE.department}, Year: ${STUDENT_PROFILE.year}, Semester: ${STUDENT_PROFILE.semester}, CGPA: ${STUDENT_PROFILE.currentCGPA}.
Academic Advisor: ${STUDENT_PROFILE.advisor} (${STUDENT_PROFILE.advisorEmail}).

Subjects & Attendance:
${SUBJECTS_DATA.map((s) => `- ${s.name} (${s.code}): ${s.attendancePct}% attendance (${s.classesAttended}/${s.classesConducted}), Internal marks: ${s.internalMarks}/${s.maxInternalMarks}, Faculty: ${s.faculty} (${s.facultyRoom}). Exam in ${s.daysToExam} days (${s.nextExamDate})`).join('\n')}

Upcoming Exams:
${EXAMS_LIST.map((e) => `- ${e.subject} (${e.code}): Date: ${e.date}, Time: ${e.time}, Venue: ${e.venue}, In ${e.daysRemaining} days. Key topics: ${e.keyTopics.join(', ')}`).join('\n')}

Pending Assignments:
${INITIAL_ASSIGNMENTS.map((a) => `- ${a.title} (${a.subject}): Due ${a.deadline}, Est. time: ${a.estimatedTime}, Difficulty: ${a.difficulty}, Priority: ${a.priority}`).join('\n')}

Today's Schedule (Monday):
${TIMETABLE_DATA.filter((t) => t.day === 'Monday').map((t) => `- ${t.startTime} - ${t.endTime}: ${t.subject} in ${t.room} (${t.faculty})${t.isFreePeriod ? ' [FREE PERIOD: ' + t.freeDuration + ']' : ''}`).join('\n')}

Recent Notices:
${COLLEGE_NOTICES.map((n) => `- [${n.urgency.toUpperCase()}] ${n.title} (${n.date}): ${n.content}`).join('\n')}

Campus Key Locations:
${CAMPUS_LOCATIONS.map((l) => `- ${l.name}: ${l.building}, ${l.floor}, ${l.roomNumber}. Directions: ${l.directions}`).join('\n')}

Empty / Available Rooms right now:
${EMPTY_ROOMS.map((r) => `- ${r.roomNumber} (${r.building}, ${r.floor}): ${r.status}, Free until: ${r.freeUntil}, Features: ${r.features.join(', ')}`).join('\n')}

STRICT RULES:
1. Ground every answer strictly in the official college data above.
2. NEVER invent college-specific information, fake dates, or nonexistent faculty.
3. If the requested information is not in the database, you MUST reply with: "I couldn't find this information in the college database."
4. Be supportive, concise, actionable, and student-focused. Highlight specific numbers (e.g. attendance percentage, exam days, room numbers).
`;

// Helper for local knowledge base fallback matching
function queryLocalDatabase(question: string): string | null {
  const qLower = question.toLowerCase();
  for (const item of KNOWLEDGE_BASE_QA) {
    if (item.keywords.some((kw) => qLower.includes(kw))) {
      return item.answer;
    }
  }

  // Common heuristics
  if (qLower.includes('cgpa') || qLower.includes('gpa')) {
    return `Your current CGPA is ${STUDENT_PROFILE.currentCGPA}, and your target is ${STUDENT_PROFILE.targetCGPA}. To reach 8.0, you need an SGPA of 8.0 or higher in Semester 1 (targeting A/A+ grades in 4-credit courses like Data Structures and Java).`;
  }
  if (qLower.includes('advisor') || qLower.includes('mentor')) {
    return `Your academic advisor is ${STUDENT_PROFILE.advisor} (${STUDENT_PROFILE.advisorEmail}, Tech Block A Room 314). Mentorship hours are every Friday at 3:15 PM.`;
  }
  if (qLower.includes('room 204') || qLower.includes('empty room') || qLower.includes('free classroom')) {
    return `Room 204 in Tech Block A (2nd Floor) is currently Available until 01:10 PM (2 hours 10 minutes free). It features Air Conditioning, Smart Projector, and Fast Wi-Fi.`;
  }

  return null;
}

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smart College Assistant API', time: new Date().toISOString() });
});

// API Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAIClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: COLLEGE_CONTEXT,
            temperature: 0.2,
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          return res.json({ reply, source: 'gemini-3.8-flash' });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local college database engine:', geminiError);
      }
    }

    // Deterministic fallback grounded strictly in the college database
    const localMatch = queryLocalDatabase(message);
    if (localMatch) {
      return res.json({ reply: localMatch, source: 'college-database-engine' });
    }

    return res.json({
      reply: "I couldn't find this information in the college database.",
      source: 'college-database-engine',
    });
  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: 'Failed to process college query' });
  }
});

// Start the server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart College Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
