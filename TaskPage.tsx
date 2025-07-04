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

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: Math.max(lines, 20) }, (_, i) => i + 1));
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-gray-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] shadow-2xl border border-[#333333] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-[#4ade80]/10 to-[#3b82f6]/10 blur-xl"></div>
        </div>
        <p className="text-gray-400 font-mono text-lg">Loading task...</p>
        <div className="mt-2 w-32 h-1 mx-auto bg-[#1e1e1e] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#4ade80] to-[#3b82f6] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-gray-100">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ade80]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#111111]/90 to-[#1a1a1a]/90 backdrop-blur-xl border border-[#2a2a2a]/50 shadow-2xl">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ade80] to-[#3b82f6] mb-2">
                {task.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm">
                <span className="font-mono bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] px-3 py-1.5 rounded-xl border border-[#333333] shadow-lg">
                  📚 {course.title}
                </span>
                <div className="hidden sm:block w-px h-4 bg-[#333333]"></div>
                <span className="font-mono bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] px-3 py-1.5 rounded-xl border border-[#333333] shadow-lg">
                  🎯 Task {Number(params.taskIndex) + 1} of {course.tasks.length}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#3a3a3a] text-gray-300 font-mono text-sm transition-all duration-500 border border-[#333333] hover:border-[#4a4a4a] shadow-xl hover:shadow-2xl flex items-center whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Course
            </button>
          </div>

          {/* Task Description with Glass Effect */}
          <div className="bg-gradient-to-r from-[#111111]/80 to-[#1a1a1a]/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border-l-4 border-gradient-to-b from-[#3b82f6] to-[#4ade80] shadow-2xl border border-[#2a2a2a]/50">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#4ade80] flex items-center justify-center mr-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-mono font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#4ade80]">
                TASK DESCRIPTION
              </h2>
            </div>
            <p className="text-gray-300 font-mono leading-relaxed text-sm md:text-base pl-14">
              {task.description}
            </p>
          </div>

          {/* Premium Apple Terminal-style Code Editor */}
          <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl border border-[#2a2a2a]/50">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222222] px-6 py-4 flex items-center border-b border-[#333333]/50">
              <div className="flex space-x-3 mr-6">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-lg"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-lg"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-lg"></div>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-[#4ade80] rounded-full mr-2 animate-pulse"></span>
                  editor.js
                </span>
                <div className="hidden md:flex items-center space-x-4">
                  <span className="bg-[#2a2a2a] px-2 py-1 rounded-md">UTF-8</span>
                  <span className="bg-[#2a2a2a] px-2 py-1 rounded-md">JavaScript</span>
                  <span className="bg-[#2a2a2a] px-2 py-1 rounded-md">{code.length} chars</span>
                </div>
              </div>
            </div>
            
            {/* Code Editor Container */}
            <div className="relative bg-gradient-to-br from-[#0d1117] to-[#111111]">
              <div className="flex">
                {/* Line Numbers */}
                <div className="flex-shrink-0 bg-[#1a1a1a]/50 border-r border-[#333333]/30 px-4 py-6 text-right">
                  {lineNumbers.map((num) => (
                    <div
                      key={num}
                      className="font-mono text-xs text-gray-500 leading-6 select-none"
                      style={{ lineHeight: '1.5rem' }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                
                {/* Code Input */}
                <div className="flex-1 relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="// Welcome to the premium code editor
// Type your JavaScript code here...
// Press Cmd+Enter to run (Ctrl+Enter on Windows)

function solution() {
  // Your code here
}"
                    className={`w-full h-96 font-mono text-[#e6edf3] bg-transparent p-6 focus:outline-none resize-none placeholder-gray-500 leading-6 ${submitted ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={submitted}
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.5rem',
                    }}
                    spellCheck={false}
                  />
                  
                  {/* Syntax highlighting overlay (you can enhance this further) */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Add subtle grid pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '100% 1.5rem'
                    }}></div>
                  </div>
                </div>
              </div>
              
              {/* Terminal Footer */}
              <div className="bg-[#1a1a1a]/50 border-t border-[#333333]/30 px-6 py-3 flex items-center justify-between text-xs font-mono text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-[#4ade80] rounded-full mr-2"></span>
                    Ready
                  </span>
                  <span>Line {code.split('\n').length}</span>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <span>Spaces: 2</span>
                  <span>Encoding: UTF-8</span>
                  <span>EOL: LF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Submit Button */}
          {!submitted && (
            <div className="flex justify-center mb-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`group relative px-8 py-4 rounded-2xl font-mono font-bold text-lg transition-all duration-500 shadow-2xl ${
                  loading 
                    ? 'bg-gradient-to-r from-[#3a3a3a] to-[#4a4a4a] cursor-wait text-gray-400' 
                    : 'bg-gradient-to-r from-[#4ade80] to-[#3b82f6] hover:from-[#3bc973] hover:to-[#2563eb] text-white hover:shadow-[0_0_40px_rgba(74,222,128,0.4)] hover:scale-105'
                } flex items-center justify-center min-w-[200px]`}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#4ade80]/20 to-[#3b82f6]/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative flex items-center">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 mr-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Evaluating Code...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      Submit Solution
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Premium Feedback Terminal */}
          {feedback && (
            <div className={`rounded-3xl overflow-hidden border shadow-2xl ${
              feedback.includes("✅") 
                ? 'border-[#10b981]/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                : 'border-[#ef4444]/30 shadow-[0_0_40px_rgba(239,68,68,0.1)]'
            }`}>
              {/* Terminal Header */}
              <div className={`px-6 py-4 flex items-center justify-between backdrop-blur-xl ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-r from-[#10b981]/10 to-[#059669]/10 border-b border-[#10b981]/20' 
                  : 'bg-gradient-to-r from-[#ef4444]/10 to-[#dc2626]/10 border-b border-[#ef4444]/20'
              }`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shadow-lg ${
                    feedback.includes("✅") 
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669]' 
                      : 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {feedback.includes("✅") ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-lg">
                      {feedback.includes("✅") ? 'SUCCESS ✨' : 'ERROR ⚠️'}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">Code execution completed</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-gray-400 flex items-center bg-[#1a1a1a]/50 px-3 py-1.5 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              
              {/* Feedback Content */}
              <div className={`p-6 md:p-8 backdrop-blur-xl ${
                feedback.includes("✅") 
                  ? 'bg-gradient-to-br from-[#10b981]/5 to-[#059669]/5' 
                  : 'bg-gradient-to-br from-[#ef4444]/5 to-[#dc2626]/5'
              }`}>
                <div className={`font-mono text-sm leading-relaxed p-4 rounded-2xl border ${
                  feedback.includes("✅") 
                    ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#a7f3d0]' 
                    : 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#fca5a5]'
                }`}>
                  <pre className="whitespace-pre-wrap">{feedback}</pre>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => router.push(`/course/${params.id}`)}
                    className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1e1e1e] to-[#2a2a2a] hover:from-[#2a2a2a] hover:to-[#3a3a3a] text-gray-300 font-mono text-sm transition-all duration-500 border border-[#333333] hover:border-[#4a4a4a] shadow-xl hover:shadow-2xl flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Tasks
                  </button>
                  {hasNextTask && (
                    <button
                      onClick={() =>
                        router.push(`/course/${params.id}/task/${nextTaskIndex}`)
                      }
                      className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-mono text-sm transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#3b82f6]/30 flex items-center justify-center"
                    >
                      Next Task
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}
                  {!hasNextTask && (
                    <button
                      onClick={() => router.push(`/course/${params.id}`)}
                      className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9] text-white font-mono text-sm transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#8b5cf6]/30 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete Course
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