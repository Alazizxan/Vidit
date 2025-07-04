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
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const router = useRouter();
  const params = useParams();

  // Fix hydration error by detecting client-side
  useEffect(() => {
    setIsClient(true);
    // Generate matrix characters
    const chars = ['0', '1', 'A', 'B', 'C', 'D', 'E', 'F', '{', '}', '<', '>', '(', ')', '[', ']', '/', '\\', '|', '-', '_', '=', '+', '*', '#', '@', '$', '%', '&'];
    setMatrixChars(chars);
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

  // Matrix-style particles for hacker theme
  const matrixParticles = [
    { left: 5, top: 10, char: '0', delay: 0.2, duration: 3 },
    { left: 15, top: 70, char: '1', delay: 1.1, duration: 4 },
    { left: 85, top: 30, char: 'A', delay: 0.7, duration: 3.5 },
    { left: 25, top: 50, char: 'F', delay: 1.8, duration: 5 },
    { left: 65, top: 20, char: '{', delay: 0.4, duration: 4.2 },
    { left: 95, top: 80, char: '}', delay: 2.1, duration: 3.8 },
    { left: 45, top: 90, char: '<', delay: 1.5, duration: 5.2 },
    { left: 75, top: 60, char: '>', delay: 0.9, duration: 4.7 },
    { left: 35, top: 40, char: '#', delay: 1.3, duration: 3.3 },
    { left: 55, top: 15, char: '@', delay: 0.6, duration: 4.8 },
  ];

  if (!task) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/20 text-green-400 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Matrix Background - Only on client */}
      {isClient && (
        <div className="absolute inset-0">
          {/* Matrix falling characters */}
          {matrixParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-green-400 font-mono text-xs opacity-60 animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.char}
            </div>
          ))}
          
          {/* Digital rain effect */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gradient-to-b from-green-400 to-transparent animate-pulse"
                style={{
                  left: `${(i + 1) * 5}%`,
                  height: '100%',
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center relative z-10">
        <div className="relative mb-8">
          {/* Hacker-style loading container */}
          <div className="w-24 h-24 mx-auto rounded-lg bg-black/80 border-2 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center backdrop-blur-sm">
            <div className="relative">
              {/* Main spinner */}
              <div className="w-12 h-12 border-2 border-green-400 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
              {/* Inner spinner */}
              <div className="absolute inset-2 w-8 h-8 border-2 border-orange-500 border-b-transparent border-l-transparent rounded-full animate-spin reverse"></div>
              {/* Center dot */}
              <div className="absolute inset-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          {/* Glow effects */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-lg bg-green-400/20 blur-xl animate-pulse"></div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-lg border border-green-400/30 animate-ping"></div>
          
          {/* Orbiting binary */}
          {isClient && (
            <div className="absolute inset-0 w-40 h-40 mx-auto">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-green-400 font-mono text-xs animate-pulse">01</div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-orange-500 font-mono text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>10</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-blue-400 font-mono text-xs animate-pulse" style={{ animationDelay: '1s' }}>11</div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-orange-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
            [ INITIALIZING HACKER MODE ]
          </h2>
          <div className="space-y-3">
            {/* Terminal-style progress bar */}
            <div className="w-64 h-3 mx-auto bg-black border border-green-400 rounded overflow-hidden shadow-[inset_0_0_10px_rgba(34,197,94,0.3)]">
              <div className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-orange-500 animate-pulse"></div>
            </div>
            <div className="text-xs text-green-400/80 font-mono space-y-1">
              <p className="animate-pulse">Loading neural networks...</p>
              <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>Establishing secure connection...</p>
              <p className="animate-pulse" style={{ animationDelay: '1s' }}>Compiling quantum algorithms...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/10 text-green-400 relative overflow-hidden">
      {/* Advanced Hacker Background Effects - Only on client */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Matrix Code Rain */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-green-400/20 font-mono text-xs"
                style={{
                  left: `${(i + 1) * 6.67}%`,
                  top: '0%',
                  animation: `matrix-fall ${4 + (i % 3)}s linear infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                {matrixChars[i % matrixChars.length]}
              </div>
            ))}
          </div>
          
          {/* Cyber Grid */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          {/* Floating Glitch Particles */}
          {matrixParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-orange-500 font-mono text-sm opacity-30 animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.char}
            </div>
          ))}
          
          {/* Scanning Lines */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent animate-scan"></div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Ultra Hacker Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 md:mb-10 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl bg-black/80 backdrop-blur-xl border border-green-400/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] relative overflow-hidden">
            {/* Glitch overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-orange-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
            
            <div className="mb-4 xl:mb-0 relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black border-2 border-green-400 flex items-center justify-center mr-3 md:mr-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-xs font-mono text-green-400 tracking-wider animate-pulse">ACTIVE_SESSION.exe</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-orange-500 mb-4 leading-tight drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                {`> ${task.title.toLowerCase().replace(/\s+/g, '_')}`}
              </h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-400 text-xs md:text-sm">
                <div className="flex items-center space-x-2 font-mono bg-black/60 border border-green-400/30 px-2 md:px-4 py-1.5 md:py-2 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-green-400/20 border border-green-400/40 flex items-center justify-center">
                    <span className="text-xs md:text-sm text-green-400">📚</span>
                  </div>
                  <span className="text-green-400 text-xs md:text-sm">[{course.title.toLowerCase()}]</span>
                </div>
                <div className="hidden sm:block w-px h-4 md:h-6 bg-green-400/30"></div>
                <div className="flex items-center space-x-2 font-mono bg-black/60 border border-orange-500/30 px-2 md:px-4 py-1.5 md:py-2 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                    <span className="text-xs md:text-sm text-orange-500">🎯</span>
                  </div>
                  <span className="text-orange-500 text-xs md:text-sm">mission_{Number(params.taskIndex) + 1}/{course.tasks.length}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="group relative px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl bg-black/60 border border-red-500/40 hover:border-red-400 text-red-400 hover:text-red-300 font-mono text-xs md:text-sm transition-all duration-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center whitespace-nowrap backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:-translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="relative z-10">[EXIT]</span>
            </button>
          </div>

          {/* Hacker Terminal Task Description */}
          <div className="bg-black/80 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 md:mb-10 border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] relative overflow-hidden">
            {/* Scan lines effect */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.3) 2px, rgba(59, 130, 246, 0.3) 4px)`,
            }}></div>
            
            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 relative z-10">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 border-blue-400 bg-black flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)] relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="absolute inset-0 rounded-lg bg-blue-400/20 blur-lg animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-mono font-black text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-green-400 to-orange-500 mb-3 md:mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                  [ MISSION_BRIEFING ]
                </h2>
                <div className="text-blue-300 font-mono leading-relaxed text-sm md:text-base lg:text-lg bg-black/40 border border-blue-400/20 rounded-lg p-4 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
                  <span className="text-green-400">root@hacker:~$</span> <span className="text-blue-300">{task.description}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra Hacker Code Terminal */}
          <div className="relative mb-6 md:mb-10 rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.3)] border border-green-400/30 group">
            {/* Terminal glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-orange-500/10 blur-xl group-hover:blur-2xl transition-all duration-700"></div>
            
            {/* Elite Terminal Header */}
            <div className="relative bg-black border-b border-green-400/30 px-4 md:px-8 py-3 md:py-5 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center space-x-3 md:space-x-6">
                {/* Hacker traffic lights */}
                <div className="flex space-x-2 md:space-x-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                
                {/* Terminal info */}
                <div className="flex items-center space-x-2 md:space-x-4 text-xs font-mono text-green-400">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-400 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-600'} transition-colors`}></div>
                    <span className="text-green-400">hacker_terminal.js</span>
                  </div>
                  <div className="hidden lg:flex items-center space-x-2 md:space-x-4">
                    <span className="bg-black border border-green-400/30 px-2 md:px-3 py-1 rounded text-green-400">UTF-8</span>
                    <span className="bg-black border border-blue-400/30 px-2 md:px-3 py-1 rounded text-blue-400">JS</span>
                    <span className="bg-black border border-orange-500/30 px-2 md:px-3 py-1 rounded text-orange-500">{code.length}B</span>
                  </div>
                </div>
              </div>
              
              {/* System status */}
              <div className="flex items-center space-x-2 md:space-x-4 text-xs font-mono">
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-green-400">ONLINE</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <span>Ln:{cursorPosition.line} Col:{cursorPosition.column}</span>
                </div>
              </div>
            </div>
            
            {/* Hacker Code Editor Container */}
            <div className="relative bg-black">
              <div className="flex">
                {/* Elite Line Numbers */}
                <div className="flex-shrink-0 bg-black border-r border-green-400/20 px-2 md:px-6 py-4 md:py-8 text-right">
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      className={`font-mono text-xs md:text-sm leading-6 md:leading-7 select-none transition-all duration-300 ${
                        num === cursorPosition.line 
                          ? 'text-green-400 font-bold glow-text shadow-[0_0_5px_rgba(34,197,94,0.8)]' 
                          : 'text-green-400/40 hover:text-green-400/70'
                      }`}
                    >
                      {num.toString().padStart(3, '0')}
                    </div>
                  ))}
                </div>
                
                {/* Code Input Terminal */}
                <div className="flex-1 relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`// Welcome to ELITE HACKER TERMINAL v2.1.337
// Your mission, should you choose to accept it...
// Write code that would make Neo proud 😎

function hackTheMatrix() {
  // There is no spoon...
  // The code is the key
  
}

// Remember: With great power comes great responsibility`}
                    className={`w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] font-mono text-green-400 bg-black p-3 md:p-8 focus:outline-none resize-none placeholder-green-400/50 leading-6 md:leading-7 text-xs md:text-sm transition-all duration-300 ${
                      submitted ? 'opacity-70 cursor-not-allowed' : 'focus:shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]'
                    }`}
                    disabled={submitted}
                    spellCheck={false}
                    style={{
                      textShadow: '0 0 5px rgba(34, 197, 94, 0.5)',
                      caretColor: '#22c55e'
                    }}
                  />
                  
                  {/* Matrix overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px)`,
                      backgroundSize: '100% 1.5rem'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* Elite Terminal Footer */}
              <div className="bg-black border-t border-green-400/20 px-3 md:px-8 py-2 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-mono backdrop-blur-xl space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 md:space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                    <span className="text-green-400">NEURAL_LINK_ACTIVE</span>
                  </div>
                  <span className="text-blue-400">Lines: {code.split('\n').length}</span>
                  <span className="hidden sm:inline text-orange-500">Tokens: {code.split(/\s+/).filter(w => w.length > 0).length}</span>
                </div>
                <div className="hidden lg:flex items-center space-x-4 md:space-x-6 text-green-400/60">
                  <span>QUANTUM_MODE</span>
                  <span>AI_ASSIST</span>
                  <span>ENCRYPTION: AES-256</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elite Hacker Submit Button */}
          {!submitted && (
            <div className="flex justify-center mb-6 md:mb-10">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative px-6 md:px-12 py-3 md:py-6 rounded-xl md:rounded-2xl font-mono font-black text-base md:text-xl transition-all duration-700 ${
                  loading 
                    ? 'bg-black border border-gray-600 cursor-wait text-gray-400' 
                    : 'bg-black border-2 border-green-400 text-green-400 hover:border-orange-500 hover:text-orange-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] hover:scale-105 hover:-translate-y-2'
                } flex items-center justify-center min-w-[200px] md:min-w-[280px] overflow-hidden`}
              >
                {/* Button glow effects */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-green-400/20 via-blue-400/20 to-orange-500/20 blur-xl group-hover:blur-2xl transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative flex items-center space-x-3 md:space-x-4">
                  {loading ? (
                    <>
                      <div className="relative">
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-5 h-5 md:w-6 md:h-6 border-2 border-green-400 border-b-transparent rounded-full animate-spin reverse"></div>
                      </div>
                      <span>[ EXECUTING NEURAL SCAN... ]</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-7 md:w-7 transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>[ INITIATE HACK ]</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Elite Hacker Feedback Terminal */}
          {feedback && (
            <div className={`rounded-xl md:rounded-2xl overflow-hidden border shadow-[0_0_50px_rgba(34,197,94,0.3)] relative ${
              feedback.includes("✅") 
                ? 'border-green-400/40 shadow-[0_0_50px_rgba(34,197,94,0.4)]' 
                : 'border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
            }`}>
              {/* Matrix glow effects */}
              <div className={`absolute inset-0 rounded-xl md:rounded-2xl ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-green-400/10 to-blue-400/10' 
                  : 'bg-gradient-to-r from-red-500/10 to-orange-500/10'
              } blur-2xl`}></div>
              
              {/* Hacker Terminal Header */}
              <div className={`relative px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black backdrop-blur-xl border-b space-y-4 sm:space-y-0 ${
                feedback.includes("✅") 
                  ? 'border-green-400/30' 
                  : 'border-red-500/30'
              }`}>
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 flex items-center justify-center shadow-[0_0_30px] relative ${
                    feedback.includes("✅") 
                      ? 'border-green-400 bg-black shadow-green-400/50' 
                      : 'border-red-500 bg-black shadow-red-500/50'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 md:h-8 md:w-8 ${
                      feedback.includes("✅") ? 'text-green-400' : 'text-red-500'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feedback.includes("✅") ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <div className={`absolute inset-0 rounded-lg blur-lg animate-pulse ${
                      feedback.includes("✅") ? 'bg-green-400/30' : 'bg-red-500/30'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-mono font-black text-lg md:text-2xl mb-2">
                      {feedback.includes("✅") ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                          [ HACK_SUCCESSFUL ] ✨
                        </span>
                      ) : (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                          [ ACCESS_DENIED ] ⚠️
                        </span>
                      )}
                    </h3>
                    <p className="text-xs md:text-sm font-mono">
                      <span className={feedback.includes("✅") ? 'text-green-400' : 'text-red-500'}>
                        root@matrix:~$
                      </span>
                      <span className="text-gray-400 ml-2">neural_scan_complete</span>
                    </p>
                  </div>
                </div>
                <div className="text-xs font-mono flex items-center bg-black/60 border px-3 md:px-4 py-1.5 md:py-2 rounded-lg backdrop-blur-xl space-x-2 border-green-400/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-400">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              
              {/* Matrix Feedback Content */}
              <div className={`p-4 sm:p-6 md:p-8 lg:p-10 bg-black backdrop-blur-xl relative overflow-hidden`}>
                {/* Matrix scan lines */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${
                    feedback.includes("✅") ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                  } 2px, ${
                    feedback.includes("✅") ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                  } 4px)`,
                }}></div>
                
                <div className={`font-mono text-xs md:text-sm leading-relaxed p-4 md:p-6 rounded-xl border relative ${
                  feedback.includes("✅") 
                    ? 'bg-black/60 border-green-400/30 text-green-300 shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]' 
                    : 'bg-black/60 border-red-500/30 text-red-300 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]'
                }`}>
                  {/* Terminal prompt */}
                  <div className="flex items-start space-x-2 mb-3">
                    <span className={feedback.includes("✅") ? 'text-green-400' : 'text-red-500'}>
                      neural@matrix:~/output$
                    </span>
                    <div className="w-2 h-4 bg-green-400 animate-pulse"></div>
                  </div>
                  
                  <pre className="whitespace-pre-wrap overflow-x-auto" style={{
                    textShadow: `0 0 5px ${feedback.includes("✅") ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                  }}>
                    {feedback}
                  </pre>
                  
                  {/* Matrix footer */}
                  <div className="mt-4 pt-3 border-t border-green-400/20 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400">STATUS:</span>
                      <span className={feedback.includes("✅") ? 'text-blue-400' : 'text-orange-500'}>
                        {feedback.includes("✅") ? 'MATRIX_BREACHED' : 'FIREWALL_ACTIVE'}
                      </span>
                    </div>
                    <div className="text-green-400/60">
                      EXEC_TIME: {Math.random().toFixed(3)}ms
                    </div>
                  </div>
                </div>
                
                {/* Elite Action Buttons */}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mt-6 md:mt-10">
                  <button
                    onClick={() => router.push(`/course/${params.id}`)}
                    className="group px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl bg-black/60 border border-blue-400/30 hover:border-blue-400 text-blue-400 hover:text-blue-300 font-mono text-xs md:text-sm transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center justify-center backdrop-blur-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 transition-transform group-hover:-translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="relative z-10">[ RETURN_TO_BASE ]</span>
                  </button>
                  
                  {hasNextTask && (
                    <button
                      onClick={() =>
                        router.push(`/course/${params.id}/task/${nextTaskIndex}`)
                      }
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl bg-black/60 border border-green-400/30 hover:border-green-400 text-green-400 hover:text-green-300 font-mono text-xs md:text-sm transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative z-10">[ NEXT_MISSION ]</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2 md:ml-3 transition-transform group-hover:translate-x-2 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                  
                  {!hasNextTask && (
                    <button
                      onClick={() => router.push(`/course/${params.id}`)}
                      className="group px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl bg-black/60 border border-orange-500/30 hover:border-orange-500 text-orange-500 hover:text-orange-300 font-mono text-xs md:text-sm transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] flex items-center justify-center overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="relative z-10">[ MISSION_COMPLETE ]</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Elite Hacker CSS Animations */}
      <style jsx>{`
        @keyframes matrix-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes neon-pulse {
          0%, 100% { 
            box-shadow: 0 0 5px #22c55e, 0 0 10px #22c55e, 0 0 15px #22c55e;
          }
          50% { 
            box-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e;
          }
        }
        @keyframes cyber-glow {
          0%, 100% { text-shadow: 0 0 5px #22c55e; }
          50% { text-shadow: 0 0 10px #22c55e, 0 0 20px #22c55e; }
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(34, 197, 94, 0.8);
          animation: cyber-glow 2s ease-in-out infinite;
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .animate-glitch {
          animation: glitch 0.3s ease-in-out infinite;
        }
        .neon-border {
          animation: neon-pulse 2s ease-in-out infinite;
        }
        .reverse {
          animation-direction: reverse;
        }
        
        /* Custom scrollbar for hacker theme */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
}