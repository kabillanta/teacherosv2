import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Target, Lightbulb, AlertTriangle, BookOpen, Layers } from "lucide-react";
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
        
        {/* Navigation Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="ml-4">
             <h1 className="font-serif text-2xl text-stone-900">Lesson Prep</h1>
             <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">30 Second Planner</p>
          </div>
        </div>

        {step === "input" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Subject</label>
                <select 
                  className="w-full p-4 rounded-none border-b border-stone-200 bg-transparent text-xl font-serif text-stone-900 focus:outline-none focus:border-stone-900 transition-colors appearance-none"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  value={formData.subject}
                >
                  <option value="" disabled>Select Subject</option>
                  <option value="Biology">Biology</option>
                  <option value="Math">Mathematics</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cell Structure"
                  className="w-full p-4 pl-0 rounded-none border-b border-stone-200 bg-transparent text-xl font-serif text-stone-900 focus:outline-none focus:border-stone-900 placeholder:text-stone-300 transition-colors"
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  value={formData.topic}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Class Level</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {["6", "7", "8", "9", "10", "11", "12"].map((cls) => (
                    <button 
                      key={cls}
                      onClick={() => setFormData({...formData, class: cls})}
                      className={`w-12 h-12 rounded-full font-medium border transition-all flex-shrink-0 flex items-center justify-center ${
                        formData.class === cls 
                          ? "bg-stone-900 text-white border-stone-900" 
                          : "bg-white border-stone-200 text-stone-500 hover:border-stone-400"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={generatePrep}
              disabled={!formData.topic || !formData.subject}
              className="w-full py-4 mt-8 rounded-lg bg-stone-900 text-white font-medium text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
            >
              <Sparkles className="w-5 h-5" />
              Generate Plan
            </button>
          </motion.div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-8">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-stone-100 border-t-stone-900 rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-serif text-stone-900">Consulting NCF 2023...</h3>
              <div className="flex flex-col gap-2 text-stone-500 text-sm">
                <span className="animate-pulse">Identifying misconceptions...</span>
                <span className="animate-pulse delay-75">Designing hooks...</span>
              </div>
            </div>
          </div>
        )}

        {step === "result" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="border-b border-stone-200 pb-6">
               <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Lesson Plan</span>
               <h2 className="text-3xl font-serif text-stone-900 mt-2 leading-tight">Cell Structure</h2>
               <div className="flex gap-3 mt-3">
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">Class 8</span>
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">Biology</span>
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">40 min</span>
               </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              
              {/* Objective */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900">Learning Outcome</h3>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  Students will be able to <span className="font-semibold text-stone-900">differentiate</span> between plant and animal cells using the 'Wall vs. Gate' analogy.
                </p>
              </div>

              {/* Hook */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900">The Hook (5 min)</h3>
                </div>
                <p className="text-stone-700 leading-relaxed italic border-l-2 border-amber-200 pl-4">
                  "Show a time-lapse of a flower wilting vs. a human collapsing. Why does the flower keep its shape?"
                </p>
              </div>

              {/* Misconceptions */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900">Common Pitfalls</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-stone-700">
                    <span className="text-rose-500 font-bold">×</span>
                    <span>Thinking all cells have walls.</span>
                  </li>
                  <li className="flex gap-3 text-stone-700">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Clarify: Only plants/bacteria need the rigid support.</span>
                  </li>
                </ul>
              </div>

              {/* Bloom's Questions */}
              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                 <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900">Check Questions</h3>
                </div>
                <div className="space-y-4">
                   <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Remember</span>
                      <p className="text-stone-800">What is the function of the nucleus?</p>
                   </div>
                   <div className="border-t border-stone-100 pt-3">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Analyze</span>
                      <p className="text-stone-800">Why don't animal cells burst when filled with water?</p>
                   </div>
                </div>
              </div>

            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => setStep("input")}
                className="flex-1 py-4 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
              >
                New Plan
              </button>
              <button className="flex-1 py-4 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4" />
                Start Class
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
