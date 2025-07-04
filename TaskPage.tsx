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
  const router = useRouter();
  const params = useParams();

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
    const lineCount = Math.max(lines.length, 25);
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

  if (!task) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] text-gray-100 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#4ade80] to-[#3b82f6] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="text-center relative z-10">
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#1e1e2e] via-[#2a2a3e] to-[#1e1e2e] shadow-2xl border border-[#4a4a6a] flex items-center justify-center backdrop-blur-xl">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-[#4ade80] border-t-transparent border-r-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-10 h-10 border-3 border-[#3b82f6] border-b-transparent border-l-transparent rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-[#4ade80]/20 via-[#3b82f6]/20 to-[#8b5cf6]/20 blur-2xl animate-pulse"></div>
          
          {/* Orbiting Elements */}
          <div className="absolute inset-0 w-32 h-32 mx-auto">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#4ade80] rounded-full animate-orbit"></div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-[#3b82f6] rounded-full animate-orbit-reverse"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#8b5cf6] rounded-full animate-orbit-slow"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#3b82f6] to-[#8b5cf6] animate-gradient">
            Loading Task Environment
          </h2>
          <div className="space-y-2">
            <div className="w-48 h-2 mx-auto bg-[#1e1e2e] rounded-full overflow-hidden border border-[#2a2a3e]">
              <div className="h-full bg-gradient-to-r from-[#4ade80] via-[#3b82f6] to-[#8b5cf6] rounded-full animate-loading-bar"></div>
            </div>
            <p className="text-sm text-gray-400 font-mono animate-pulse">Initializing premium workspace...</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(64px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(64px) rotate(-360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(360deg) translateX(64px) rotate(-360deg); }
          to { transform: rotate(0deg) translateX(64px) rotate(0deg); }
        }
        @keyframes orbit-slow {
          from { transform: rotate(0deg) translateX(64px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(64px) rotate(-360deg); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-orbit { animation: orbit 3s linear infinite; }
        .animate-orbit-reverse { animation: orbit-reverse 4s linear infinite; }
        .animate-orbit-slow { animation: orbit-slow 6s linear infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-loading-bar { animation: loading-bar 2s ease-in-out infinite; }
        .animate-reverse { animation-direction: reverse; }
      `}</style>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] text-gray-100 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#4ade80]/10 to-[#3b82f6]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#8b5cf6]/10 to-[#ec4899]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#06b6d4]/5 to-[#8b5cf6]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#4ade80] to-[#3b82f6] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 xl:p-12">
        <div className="max-w-8xl mx-auto">
          {/* Ultra Premium Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-10 p-8 rounded-[2rem] bg-gradient-to-br from-[#0f0f1a]/95 via-[#1a1a2e]/90 to-[#0f0f1a]/95 backdrop-blur-2xl border border-[#2a2a4a]/30 shadow-2xl relative overflow-hidden">
            {/* Header Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4ade80]/5 via-transparent to-[#3b82f6]/5"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4ade80]/50 to-transparent"></div>
            
            <div className="mb-6 xl:mb-0 relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ade80] to-[#3b82f6] flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono text-[#4ade80] tracking-wider">ACTIVE SESSION</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#3b82f6] to-[#8b5cf6] mb-4 leading-tight">
                {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center space-x-2 font-mono bg-gradient-to-r from-[#1a1a2e]/80 to-[#2a2a3e]/80 px-4 py-2 rounded-2xl border border-[#3a3a5a]/30 shadow-lg backdrop-blur-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4ade80]/20 to-[#3b82f6]/20 flex items-center justify-center">
                    <span className="text-lg">📚</span>
                  </div>
                  <span className="text-white">{course.title}</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-[#3a3a5a]/50"></div>
                <div className="flex items-center space-x-2 font-mono bg-gradient-to-r from-[#1a1a2e]/80 to-[#2a2a3e]/80 px-4 py-2 rounded-2xl border border-[#3a3a5a]/30 shadow-lg backdrop-blur-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#8b5cf6]/20 to-[#ec4899]/20 flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <span className="text-white">Task {Number(params.taskIndex) + 1} of {course.tasks.length}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1a1a2e]/80 to-[#2a2a3e]/80 hover:from-[#2a2a3e]/90 hover:to-[#3a3a4e]/90 text-gray-300 hover:text-white font-mono text-sm transition-all duration-700 border border-[#3a3a5a]/30 hover:border-[#4a4a6a]/50 shadow-xl hover:shadow-2xl flex items-center whitespace-nowrap backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4ade80]/0 via-[#4ade80]/10 to-[#4ade80]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="relative z-10">Back to Course</span>
            </button>
          </div>

          {/* Ultra Modern Task Description */}
          <div className="bg-gradient-to-br from-[#0f0f1a]/95 via-[#1a1a2e]/90 to-[#0f0f1a]/95 backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 mb-10 border border-[#2a2a4a]/30 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(74, 222, 128, 0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
            
            <div className="flex items-start space-x-6 relative z-10">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#4ade80] via-[#3b82f6] to-[#8b5cf6] flex items-center justify-center shadow-2xl relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#4ade80]/30 to-[#3b82f6]/30 blur-xl animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-mono font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] via-[#3b82f6] to-[#8b5cf6] mb-4">
                  TASK DESCRIPTION
                </h2>
                <p className="text-gray-300 font-mono leading-relaxed text-base md:text-lg">
                  {task.description}
                </p>
              </div>
            </div>
          </div>

          {/* Revolutionary Code Editor */}
          <div className="relative mb-10 rounded-[2rem] overflow-hidden shadow-2xl border border-[#2a2a4a]/30 group">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4ade80]/10 via-[#3b82f6]/10 to-[#8b5cf6]/10 blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            
            {/* Terminal Header with Advanced UI */}
            <div className="relative bg-gradient-to-r from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] px-8 py-5 flex items-center justify-between border-b border-[#2a2a4a]/30 backdrop-blur-2xl">
              <div className="flex items-center space-x-6">
                {/* Traffic Lights */}
                <div className="flex space-x-3">
                  <div className="relative group/light">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#ff5f56] to-[#ff3333] shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute inset-0 rounded-full bg-[#ff5f56] blur-md opacity-50 group-hover/light:opacity-75 transition-opacity"></div>
                  </div>
                  <div className="relative group/light">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#ffbd2e] to-[#ffaa00] shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute inset-0 rounded-full bg-[#ffbd2e] blur-md opacity-50 group-hover/light:opacity-75 transition-opacity"></div>
                  </div>
                  <div className="relative group/light">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#27c93f] to-[#00cc44] shadow-lg cursor-pointer hover:scale-110 transition-transform"></div>
                    <div className="absolute inset-0 rounded-full bg-[#27c93f] blur-md opacity-50 group-hover/light:opacity-75 transition-opacity"></div>
                  </div>
                </div>
                
                {/* File Info */}
                <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-[#4ade80] animate-pulse' : 'bg-gray-500'} transition-colors`}></div>
                    <span className="text-gray-300">solution.js</span>
                  </div>
                  <div className="hidden lg:flex items-center space-x-4">
                    <span className="bg-[#2a2a3e] px-3 py-1 rounded-lg">UTF-8</span>
                    <span className="bg-[#2a2a3e] px-3 py-1 rounded-lg">JavaScript</span>
                    <span className="bg-[#2a2a3e] px-3 py-1 rounded-lg">{code.length} chars</span>
                  </div>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                <div className="hidden md:flex items-center space-x-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#4ade80]">Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                </div>
              </div>
            </div>
            
            {/* Code Editor Container */}
            <div className="relative bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]">
              <div className="flex">
                {/* Enhanced Line Numbers */}
                <div className="flex-shrink-0 bg-gradient-to-b from-[#0f0f1a]/80 to-[#1a1a2e]/80 border-r border-[#2a2a4a]/30 px-6 py-8 text-right backdrop-blur-xl">
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      className={`font-mono text-sm leading-7 select-none transition-colors ${
                        num === cursorPosition.line 
                          ? 'text-[#4ade80] font-bold' 
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
                    className={`w-full h-[500px] font-mono text-[#e6edf3] bg-transparent p-8 focus:outline-none resize-none placeholder-gray-500 leading-7 text-sm transition-all duration-300 ${
                      submitted ? 'opacity-70 cursor-not-allowed' : 'focus:bg-[#0a0a0f]/50'
                    }`}
                    disabled={submitted}
                    spellCheck={false}
                  />
                  
                  {/* Syntax Highlighting Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px)`,
                      backgroundSize: '100% 1.75rem'
                    }}></div>
                  </div>
                  
                  {/* Cursor Indicator */}
                  {!submitted && (
                    <div 
                      className="absolute w-0.5 h-6 bg-[#4ade80] animate-pulse pointer-events-none"
                      style={{
                        top: `${(cursorPosition.line - 1) * 1.75 + 2}rem`,
                        left: `${cursorPosition.column * 0.6 + 2}rem`
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* Enhanced Terminal Footer */}
              <div className="bg-gradient-to-r from-[#0f0f1a]/90 to-[#1a1a2e]/90 border-t border-[#2a2a4a]/30 px-8 py-4 flex items-center justify-between text-xs font-mono text-gray-500 backdrop-blur-xl">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></div>
                    <span className="text-[#4ade80]">Live Session</span>
                  </div>
                  <span>Lines: {code.split('\n').length}</span>
                  <span>Words: {code.split(/\s+/).filter(w => w.length > 0).length}</span>
                </div>
                <div className="hidden lg:flex items-center space-x-6">
                  <span>Spaces: 2</span>
                  <span>Encoding: UTF-8</span>
                  <span>EOL: LF</span>
                  <span>Tab Size: 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Premium Submit Button */}
          {!submitted && (
            <div className="flex justify-center mb-10">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative px-12 py-6 rounded-3xl font-mono font-black text-xl transition-all duration-700 shadow-2xl ${
                  loading 
                    ? 'bg-gradient-to-r from-[#3a3a4a] to-[#4a4a5a] cursor-wait text-gray-400' 
                    : 'bg-gradient-to-r from-[#4ade80] via-[#3b82f6] to-[#8b5cf6] hover:from-[#3bc973] hover:via-[#2563eb] hover:to-[#7c3aed] text-white hover:shadow-[0_0_80px_rgba(74,222,128,0.4)] hover:scale-105 hover:-translate-y-2'
                } flex items-center justify-center min-w-[280px] overflow-hidden`}
              >
                {/* Button Background Effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#4ade80]/30 via-[#3b82f6]/30 to-[#8b5cf6]/30 blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center space-x-4">
                  {loading ? (
                    <>
                      <div className="relative">
                        <div className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-6 h-6 border-3 border-gray-300 border-b-transparent rounded-full animate-spin animate-reverse"></div>
                      </div>
                      <span>Evaluating Solution...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 transition-transform group-hover:translate-x-2 group-hover:scale-110 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className={`rounded-[2rem] overflow-hidden border shadow-2xl relative ${
              feedback.includes("✅") 
                ? 'border-[#10b981]/30 shadow-[0_0_80px_rgba(16,185,129,0.15)]' 
                : 'border-[#ef4444]/30 shadow-[0_0_80px_rgba(239,68,68,0.15)]'
            }`}>
              {/* Glow Effects */}
              <div className={`absolute inset-0 rounded-[2rem] ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10' 
                  : 'bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10'
              } blur-2xl`}></div>
              
              {/* Terminal Header */}
              <div className={`relative px-8 py-6 flex items-center justify-between backdrop-blur-2xl ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-[#10b981]/15 via-[#059669]/10 to-[#10b981]/15 border-b border-[#10b981]/20' 
                  : 'bg-gradient-to-r from-[#ef4444]/15 via-[#dc2626]/10 to-[#ef4444]/15 border-b border-[#ef4444]/20'
              }`}>
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl relative ${
                    feedback.includes("✅") 
                      ? 'bg-gradient-to-br from-[#10b981] to-[#059669]' 
                      : 'bg-gradient-to-br from-[#ef4444] to-[#dc2626]'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feedback.includes("✅") ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <div className={`absolute inset-0 rounded-3xl blur-xl ${
                      feedback.includes("✅") ? 'bg-[#10b981]/50' : 'bg-[#ef4444]/50'
                    } animate-pulse`}></div>
                  </div>
                  <div>
                    <h3 className="font-mono font-black text-2xl mb-2">
                      {feedback.includes("✅") ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#059669]">
                          SUCCESS ✨
                        </span>
                      ) : (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ef4444] to-[#dc2626]">
                          ERROR ⚠️
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400 font-mono">Code execution completed</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-gray-400 flex items-center bg-[#0f0f1a]/50 px-4 py-2 rounded-2xl backdrop-blur-xl border border-[#2a2a4a]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              
              {/* Feedback Content */}
              <div className={`p-8 md:p-10 backdrop-blur-2xl relative ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-br from-[#10b981]/5 via-[#059669]/3 to-[#10b981]/5' 
                  : 'bg-gradient-to-br from-[#ef4444]/5 via-[#dc2626]/3 to-[#ef4444]/5'
              }`}>
                <div className={`font-mono text-sm leading-relaxed p-6 rounded-3xl border backdrop-blur-xl ${
                  feedback.includes("✅") 
                    ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#a7f3d0]' 
                    : 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#fca5a5]'
                }`}>
                  <pre className="whitespace-pre-wrap">{feedback}</pre>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-4 mt-10">
                  <button
                    onClick={() => router.push(`/course/${params.id}`)}
                    className="group px-8 py-4 rounded-3xl bg-gradient-to-r from-[#1a1a2e]/80 to-[#2a2a3e]/80 hover:from-[#2a2a3e]/90 hover:to-[#3a3a4e]/90 text-gray-300 hover:text-white font-mono text-sm transition-all duration-700 border border-[#3a3a5a]/30 hover:border-[#4a4a6a]/50 shadow-xl hover:shadow-2xl flex items-center justify-center backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4ade80]/0 via-[#4ade80]/10 to-[#4ade80]/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:-translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="relative z-10">Back to Tasks</span>
                  </button>
                  {hasNextTask && (
                    <button
                      onClick={() =>
                        router.push(`/course/${params.id}/task/${nextTaskIndex}`)
                      }
                      className="group px-8 py-4 rounded-3xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-mono text-sm transition-all duration-700 shadow-xl hover:shadow-2xl hover:shadow-[#3b82f6]/40 flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10">Next Task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 transition-transform group-hover:translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                  {!hasNextTask && (
                    <button
                      onClick={() => router.push(`/course/${params.id}`)}
                      className="group px-8 py-4 rounded-3xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-mono text-sm transition-all duration-700 shadow-xl hover:shadow-2xl hover:shadow-[#8b5cf6]/40 flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
        }
        .animate-reverse { animation-direction: reverse; }
      `}</style>
    </div>
  );
}