import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Clock, Target, Lightbulb, ChevronRight, Check } from "lucide-react";
import { Link } from "wouter";

export default function Prep() {
  const [step, setStep] = useState<"input" | "generating" | "result">("input");
  
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    class: ""
  });

  const generatePrep = () => {
    setStep("generating");
    setTimeout(() => setStep("result"), 2000);
  };

  return (
    <Layout>
      <div className="p-6 pt-12 min-h-screen pb-32">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <button className="p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <div className="flex flex-col items-center">
             <span className="font-display font-bold text-blue-600 tracking-wider text-sm uppercase">Prep Mode</span>
             <span className="text-xs text-gray-400">30 Second Planner</span>
          </div>
          <div className="w-9" />
        </div>

        {step === "input" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject</label>
              <select 
                className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-medium"
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              >
                <option value="">Select Subject</option>
                <option value="Biology">Biology</option>
                <option value="Math">Mathematics</option>
                <option value="History">History</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Topic</label>
              <input 
                type="text" 
                placeholder="e.g. Cell Structure"
                className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition-all font-medium"
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Class Level</label>
              <div className="flex gap-3">
                {["6", "7", "8", "9", "10"].map((cls) => (
                  <button 
                    key={cls}
                    onClick={() => setFormData({...formData, class: cls})}
                    className={`flex-1 py-3 rounded-xl font-medium border transition-colors ${
                      formData.class === cls 
                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generatePrep}
              disabled={!formData.topic}
              className="w-full py-4 mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Generate Plan
            </button>
          </motion.div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-blue-600 w-8 h-8 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-bold text-gray-900">Aligning with NCF 2023...</h3>
              <p className="text-gray-500 text-sm">Checking common misconceptions...</p>
            </div>
          </div>
        )}

        {step === "result" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-display font-bold">Cell Structure</h2>
                  <p className="opacity-80">Class 8 • Biology • 40 mins</p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm text-sm leading-relaxed">
                <span className="font-bold opacity-100">NCF Goal:</span> Students develop inquiry skills around cell organelles (Stage 3).
              </div>
            </div>

            {/* Hook Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900">Opening Hook (3 min)</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Show a 30-sec time-lapse video of cell division. Ask: <span className="italic font-medium text-orange-600">"What just happened here?"</span>
              </p>
            </div>

            {/* Misconceptions */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-gray-900">Watch Out For</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-700">
                  <span className="text-red-500 font-bold">×</span>
                  <span>Thinking cell wall and membrane are the same.</span>
                </li>
                <li className="flex gap-3 text-sm text-gray-700">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Use Analogy: Wall = Brick Boundary, Membrane = Security Guard.</span>
                </li>
              </ul>
            </div>

             {/* Questions */}
             <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-gray-900">Check for Understanding</h3>
              </div>
              <div className="space-y-3">
                 <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide block mb-1">Remember</span>
                    What are the main parts of a cell?
                 </div>
                 <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide block mb-1">Apply</span>
                    If a cell lost its membrane, what would happen?
                 </div>
              </div>
            </div>

            <button 
              onClick={() => setStep("input")}
              className="w-full py-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
            >
              Plan Another Lesson
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}

// Helper for Missing Icon
function AlertCircle({ className }: { className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    )
  }
