import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  ShieldAlert,
  Loader2,
  Database,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AskCollegeChatProps {
  darkMode: boolean;
}

const SAMPLE_QUESTIONS = [
  'Do I have a class at 10 AM?',
  'When is my next exam?',
  'Which assignments are due tomorrow?',
  'What is my attendance in Java?',
  'Where is the computer lab?',
  'Who is my Data Structures faculty?',
  'What should I study today?',
  'Which subject needs the most attention?',
  'Show important notices.',
  'Do I have enough attendance?',
];

export const AskCollegeChat: React.FC<AskCollegeChatProps> = ({ darkMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello Mokshagna! I am your 'Ask My College' AI Assistant, connected directly to your official CSD department records, timetable, and campus directory. How can I help you make a better academic decision right now?",
      timestamp: 'Just now',
      sourceContext: 'Official College Records Engine',
      suggestedQuestions: [
        'Do I have a class at 10 AM?',
        'When is my next exam?',
        'What is my attendance in Java?',
        'Where is the computer lab?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText: string) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from server');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || "I couldn't find this information in the college database.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceContext: data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash (Server)' : 'College Database Engine',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      // Local fallback in case of connection hiccup
      const botMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: "I couldn't find this information in the college database.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceContext: 'College Database Engine (Offline Mode)',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: "Chat cleared. What college information can I verify for you?",
        timestamp: 'Just now',
        sourceContext: 'Official College Records Engine',
      },
    ]);
  };

  return (
    <div id="ask-college-chat-view" className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Ask My College AI
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Database className="w-3 h-3" />
                Live College Grounding
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Answers verified from student records, department timetables, and campus directory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div
        id="chat-messages-container"
        className={`flex-1 overflow-y-auto p-4 sm:p-6 rounded-2xl border space-y-4 transition-colors ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/70 border-slate-200'
        }`}
      >
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
                  isAssistant
                    ? darkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                    : 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                }`}
              >
                <div className="space-y-2 whitespace-pre-line">
                  {msg.text}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                  <span className="font-mono">{msg.timestamp}</span>
                  {msg.sourceContext && (
                    <span className="flex items-center gap-1 font-semibold text-indigo-500 dark:text-indigo-400">
                      <Database className="w-3 h-3" />
                      {msg.sourceContext}
                    </span>
                  )}
                </div>

                {/* Suggested prompt chips inside first bot message */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      Suggested Quick Prompts:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="px-2.5 py-1 rounded-lg text-left text-[11px] font-medium bg-slate-100 dark:bg-slate-700/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2 ${
                darkMode ? 'bg-slate-800 border border-slate-700 text-slate-300' : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>Querying verified college database records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Horizontal Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Quick Ask:
        </span>
        {SAMPLE_QUESTIONS.map((question, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(question)}
            className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-2xs"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSubmit}
        className={`p-2 rounded-2xl border flex items-center gap-2 shrink-0 transition-colors ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <input
          id="ask-college-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your timetable, attendance, exams, lab locations..."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />

        <button
          id="ask-college-send-btn"
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-all active:scale-95 shadow-xs"
          title="Send query to College AI"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
