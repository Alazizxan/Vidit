"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TaskPage() {
  const [course, setCourse] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const [isTyping, setIsTyping] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Fix hydration error by detecting client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const foundCourse = data.find((c: any) => c._id === params.id);

        if (!foundCourse) return router.push("/dashboard");

        setCourse(foundCourse);
        setTask(foundCourse.tasks[Number(params.taskIndex)]);
      } catch (error) {
        console.error("Kursni yuklashda xatolik:", error);
      }
    };

    fetchTask();
  }, []);

  // Update line numbers and cursor position when code changes
  useEffect(() => {
    const lines = code.split('\n');
    const lineCount = Math.max(lines.length, 20);
    setLineNumbers(Array.from({ length: lineCount }, (_, i) => i + 1));
    
    // Simulate cursor position tracking
    const lastLine = lines.length;
    const lastColumn = lines[lines.length - 1]?.length || 0;
    setCursorPosition({ line: lastLine, column: lastColumn + 1 });
  }, [code]);

  // Typing indicator
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timer);
  }, [code]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/course/submit/${params.id}/${params.taskIndex}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();
      setFeedback(data.feedback);
      setSubmitted(true);
    } catch (error) {
      console.error("Kod yuborishda xatolik:", error);
      setFeedback("❌ Kodni yuborishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Fixed particles array to prevent hydration errors
  const particlePositions = [
    { left: 10, top: 20, delay: 0.5, duration: 4 },
    { left: 80, top: 60, delay: 1.2, duration: 5 },
    { left: 30, top: 80, delay: 0.8, duration: 3.5 },
    { left: 70, top: 30, delay: 1.8, duration: 4.5 },
    { left: 50, top: 50, delay: 0.3, duration: 6 },
    { left: 90, top: 10, delay: 2.1, duration: 3.8 },
    { left: 20, top: 70, delay: 1.5, duration: 5.2 },
    { left: 60, top: 40, delay: 0.9, duration: 4.2 },
    { left: 40, top: 90, delay: 1.7, duration: 3.3 },
    { left: 85, top: 25, delay: 0.6, duration: 5.5 },
  ];

  if (!task) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-gray-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles - Only on client */}
      {isClient && (
        <div className="absolute inset-0">
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-30 animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="text-center relative z-10">
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-800/80 via-purple-800/80 to-slate-800/80 shadow-2xl border border-purple-500/30 flex items-center justify-center backdrop-blur-xl">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-10 h-10 border-3 border-purple-400 border-b-transparent border-l-transparent rounded-full animate-spin reverse"></div>
            </div>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-2xl animate-pulse"></div>
          
          {/* Orbiting Elements - Only on client */}
          {isClient && (
            <div className="absolute inset-0 w-32 h-32 mx-auto">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Loading Task Environment
          </h2>
          <div className="space-y-2">
            <div className="w-48 h-2 mx-auto bg-slate-800 rounded-full overflow-hidden border border-purple-500/30">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-400 font-mono animate-pulse">Initializing premium workspace...</p>
          </div>
        </div>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-gray-100 relative overflow-hidden">
      {/* Advanced Background Effects - Only on client */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Floating Particles */}
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      )}

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Ultra Premium Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 md:mb-10 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-2xl border border-purple-500/20 shadow-2xl relative overflow-hidden">
            {/* Header Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-purple-400/5"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
            
            <div className="mb-4 xl:mb-0 relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mr-3 md:mr-4 shadow-lg">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider">ACTIVE SESSION</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 leading-tight">
                {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-400 text-xs md:text-sm">
                <div className="flex items-center space-x-2 font-mono bg-gradient-to-r from-slate-800/80 to-purple-800/80 px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-purple-500/20 shadow-lg backdrop-blur-xl">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-cyan-400/20 to-purple-400/20 flex items-center justify-center">
                    <span className="text-sm md:text-lg">📚</span>
                  </div>
                  <span className="text-white text-xs md:text-sm">{course.title}</span>
                </div>
                <div className="hidden sm:block w-px h-4 md:h-6 bg-purple-500/30"></div>
                <div className="flex items-center space-x-2 font-mono bg-gradient-to-r from-slate-800/80 to-purple-800/80 px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl border border-purple-500/20 shadow-lg backdrop-blur-xl">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
                    <span className="text-sm md:text-lg">🎯</span>
                  </div>
                  <span className="text-white text-xs md:text-sm">Task {Number(params.taskIndex) + 1} of {course.tasks.length}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="group relative px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-slate-800/80 to-purple-800/80 hover:from-purple-800/90 hover:to-slate-800/90 text-gray-300 hover:text-white font-mono text-xs md:text-sm transition-all duration-700 border border-purple-500/20 hover:border-purple-400/50 shadow-xl hover:shadow-2xl flex items-center whitespace-nowrap backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:-translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="relative z-10">Back to Course</span>
            </button>
          </div>

          {/* Ultra Modern Task Description */}
          <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-2xl rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-10 mb-6 md:mb-10 border border-purple-500/20 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
            
            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 relative z-10">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-2xl relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-400/30 to-purple-400/30 blur-xl animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-mono font-black text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3 md:mb-4">
                  TASK DESCRIPTION
                </h2>
                <p className="text-gray-300 font-mono leading-relaxed text-sm md:text-base lg:text-lg">
                  {task.description}
                </p>
              </div>
            </div>
          </div>

          {/* Revolutionary Code Editor with Fixed Height */}
          <div className="relative mb-6 md:mb-10 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-purple-500/20 group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            
            {/* Terminal Header with Advanced UI */}
            <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 px-4 md:px-8 py-3 md:py-5 flex items-center justify-between border-b border-purple-500/20 backdrop-blur-2xl">
              <div className="flex items-center space-x-3 md:space-x-6">
                {/* Traffic Lights */}
                <div className="flex space-x-2 md:space-x-3">
                  <div className="relative group/light">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute inset-0 rounded-full bg-red-400 blur-md opacity-50 group-hover/light:opacity-75 transition-opacity"></div>
                  </div>
                  <div className="relative group/light">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-50 group-hover/light:opacity-75 transition-opacity"></div>
                  </div>
                  <div className="relative group/light">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute inset-0 rounded-full bg-green-400 blur-md opacity-50 group-hover/light:opacity-75 transition-opacity"></div>
                  </div>
                </div>
                
                {/* File Info */}
                <div className="flex items-center space-x-2 md:space-x-4 text-xs font-mono text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'} transition-colors`}></div>
                    <span className="text-gray-300">solution.js</span>
                  </div>
                  <div className="hidden lg:flex items-center space-x-2 md:space-x-4">
                    <span className="bg-purple-800 px-2 md:px-3 py-1 rounded-lg">UTF-8</span>
                    <span className="bg-purple-800 px-2 md:px-3 py-1 rounded-lg">JavaScript</span>
                    <span className="bg-purple-800 px-2 md:px-3 py-1 rounded-lg">{code.length} chars</span>
                  </div>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-2 md:space-x-4 text-xs font-mono text-gray-400">
                <div className="hidden md:flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-cyan-400">Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                </div>
              </div>
            </div>
            
            {/* Code Editor Container with Fixed Responsive Height */}
            <div className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
              <div className="flex">
                {/* Enhanced Line Numbers */}
                <div className="flex-shrink-0 bg-gradient-to-b from-slate-900/80 to-purple-900/80 border-r border-purple-500/20 px-2 md:px-6 py-4 md:py-8 text-right backdrop-blur-xl">
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      className={`font-mono text-xs md:text-sm leading-6 md:leading-7 select-none transition-colors ${
                        num === cursorPosition.line 
                          ? 'text-cyan-400 font-bold' 
                          : 'text-gray-500 hover:text-gray-400'
                      }`}
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                
                {/* Code Input Area */}
                <div className="flex-1 relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`// Welcome to the Premium Code Environment
// Start building your solution here...
// Pro tip: Use proper indentation and comments

function solution() {
  // Your brilliant code goes here
  
}

// Don't forget to test your solution!`}
                    className={`w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] font-mono text-gray-100 bg-transparent p-3 md:p-8 focus:outline-none resize-none placeholder-gray-500 leading-6 md:leading-7 text-xs md:text-sm transition-all duration-300 ${
                      submitted ? 'opacity-70 cursor-not-allowed' : 'focus:bg-slate-950/50'
                    }`}
                    disabled={submitted}
                    spellCheck={false}
                  />
                  
                  {/* Syntax Highlighting Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '100% 1.5rem'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Terminal Footer */}
              <div className="bg-gradient-to-r from-slate-900/90 to-purple-900/90 border-t border-purple-500/20 px-3 md:px-8 py-2 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-gray-500 backdrop-blur-xl space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 md:space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-cyan-400">Live Session</span>
                  </div>
                  <span>Lines: {code.split('\n').length}</span>
                  <span className="hidden sm:inline">Words: {code.split(/\s+/).filter(w => w.length > 0).length}</span>
                </div>
                <div className="hidden lg:flex items-center space-x-4 md:space-x-6">
                  <span>Spaces: 2</span>
                  <span>Encoding: UTF-8</span>
                  <span>EOL: LF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Premium Submit Button */}
          {!submitted && (
            <div className="flex justify-center mb-6 md:mb-10">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative px-6 md:px-12 py-3 md:py-6 rounded-2xl md:rounded-3xl font-mono font-black text-base md:text-xl transition-all duration-700 shadow-2xl ${
                  loading 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-wait text-gray-400' 
                    : 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-300 hover:via-purple-400 hover:to-pink-400 text-white hover:shadow-[0_0_80px_rgba(34,211,238,0.4)] hover:scale-105 hover:-translate-y-2'
                } flex items-center justify-center min-w-[200px] md:min-w-[280px] overflow-hidden`}
              >
                {/* Button Background Effects */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center space-x-3 md:space-x-4">
                  {loading ? (
                    <>
                      <div className="relative">
                        <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-5 h-5 md:w-6 md:h-6 border-3 border-gray-300 border-b-transparent rounded-full animate-spin reverse"></div>
                      </div>
                      <span>Evaluating Solution...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7 transition-transform group-hover:translate-x-2 group-hover:scale-110 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Submit Solution</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Revolutionary Feedback Terminal */}
          {feedback && (
            <div className={`rounded-2xl md:rounded-[2rem] overflow-hidden border shadow-2xl relative ${
              feedback.includes("✅") 
                ? 'border-emerald-500/30 shadow-[0_0_80px_rgba(16,185,129,0.15)]' 
                : 'border-red-500/30 shadow-[0_0_80px_rgba(239,68,68,0.15)]'
            }`}>
              {/* Glow Effects */}
              <div className={`absolute inset-0 rounded-2xl md:rounded-[2rem] ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10' 
                  : 'bg-gradient-to-r from-red-500/10 to-rose-500/10'
              } blur-2xl`}></div>
              
              {/* Terminal Header */}
              <div className={`relative px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between backdrop-blur-2xl space-y-4 sm:space-y-0 ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-emerald-500/15 via-green-500/10 to-emerald-500/15 border-b border-emerald-500/20' 
                  : 'bg-gradient-to-r from-red-500/15 via-rose-500/10 to-red-500/15 border-b border-red-500/20'
              }`}>
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl relative ${
                    feedback.includes("✅") 
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                      : 'bg-gradient-to-br from-red-500 to-rose-600'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feedback.includes("✅") ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <div className={`absolute inset-0 rounded-2xl md:rounded-3xl blur-xl ${
                      feedback.includes("✅") ? 'bg-emerald-500/50' : 'bg-red-500/50'
                    } animate-pulse`}></div>
                  </div>
                  <div>
                    <h3 className="font-mono font-black text-lg md:text-2xl mb-2">
                      {feedback.includes("✅") ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                          SUCCESS ✨
                        </span>
                      ) : (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">
                          ERROR ⚠️
                        </span>
                      )}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 font-mono">Code execution completed</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-gray-400 flex items-center bg-slate-900/50 px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl backdrop-blur-xl border border-purple-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              
              {/* Feedback Content */}
              <div className={`p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-2xl relative ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-emerald-500/5' 
                  : 'bg-gradient-to-br from-red-500/5 via-rose-500/3 to-red-500/5'
              }`}>
                <div className={`font-mono text-xs md:text-sm leading-relaxed p-4 md:p-6 rounded-2xl md:rounded-3xl border backdrop-blur-xl ${
                  feedback.includes("✅") 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' 
                    : 'bg-red-500/10 border-red-500/20 text-red-200'
                }`}>
                  <pre className="whitespace-pre-wrap">{feedback}</pre>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mt-6 md:mt-10">
                  <button
                    onClick={() => router.push(`/course/${params.id}`)}
                    className="group px-4 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-3xl bg-gradient-to-r from-slate-800/80 to-purple-800/80 hover:from-purple-800/90 hover:to-slate-800/90 text-gray-300 hover:text-white font-mono text-xs md:text-sm transition-all duration-700 border border-purple-500/20 hover:border-purple-400/50 shadow-xl hover:shadow-2xl flex items-center justify-center backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:-translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="relative z-10">Back to Tasks</span>
                  </button>
                  {hasNextTask && (
                    <button
                      onClick={() =>
                        router.push(`/course/${params.id}/task/${nextTaskIndex}`)
                      }
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs md:text-sm transition-all duration-700 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/40 flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">Next Task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3 transition-transform group-hover:translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                  {!hasNextTask && (
                    <button
                      onClick={() => router.push(`/course/${params.id}`)}
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono text-xs md:text-sm transition-all duration-700 shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="relative z-10">Complete Course</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}