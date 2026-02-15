import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ThumbsUp, ThumbsDown, Meh, TrendingUp, Calendar, ChevronDown } from "lucide-react";
import { Link } from "wouter";

type ClassSession = {
  id: string;
  time: string;
  className: string;
  section?: string;
  subject: string;
  topic?: string;
};

export default function Reflect() {
  const [submitted, setSubmitted] = useState(false);
  const [energy, setEnergy] = useState<number | null>(null);
  const [recentClasses, setRecentClasses] = useState<ClassSession[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("teacherOS_timetable");
    if (saved) {
      const schedule: ClassSession[] = JSON.parse(saved);
      // In a real app, we'd filter for classes that JUST ended.
      // For prototype, we'll just show the schedule.
      setRecentClasses(schedule);
      if (schedule.length > 0) {
          setSelectedClassId(schedule[0].id);
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedClass = recentClasses.find(c => c.id === selectedClassId);

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
    setIsDropdownOpen(false);
  };

  return (
    <Layout>
      <div className="p-6 pt-12 min-h-screen pb-32">
        
        {/* Navigation Header */}
        <div className="flex items-center mb-10">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="ml-4">
             <h1 className="font-serif text-2xl text-stone-900">Reflection</h1>
             <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Close the Loop</p>
          </div>
        </div>

        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            {/* Dynamic Class Selection */}
            <div className="space-y-3">
               <h2 className="text-3xl font-serif text-stone-900 leading-snug">
                   How did your <br/>
                   
                   <div className="relative inline-block mt-2" ref={dropdownRef}>
                     <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 border-b-2 border-stone-300 hover:border-stone-900 text-stone-900 font-bold py-1 px-0 transition-colors cursor-pointer group"
                     >
                        <span>
                            {selectedClass 
                                ? `${selectedClass.subject} (${selectedClass.className}${selectedClass.section ? `-${selectedClass.section}` : ''})` 
                                : "Select Class"
                            }
                        </span>
                        <ChevronDown className={`w-6 h-6 text-stone-400 transition-transform group-hover:text-stone-600 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                     </button>

                     <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden"
                            >
                                <div className="py-1">
                                    {recentClasses.length > 0 ? (
                                        recentClasses.map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => handleSelectClass(c.id)}
                                                className={`w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors flex flex-col ${selectedClassId === c.id ? 'bg-stone-50' : ''}`}
                                            >
                                                <span className={`font-serif font-bold ${selectedClassId === c.id ? 'text-stone-900' : 'text-stone-600'}`}>
                                                    {c.subject}
                                                </span>
                                                <span className="text-xs text-stone-400 font-medium">
                                                    Class {c.className}{c.section ? `-${c.section}` : ''} • {c.time}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-stone-400 text-sm italic">
                                            No classes scheduled
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                     </AnimatePresence>
                   </div>
                   
                   <br/> <span className="mt-2 block text-stone-400">lesson go?</span>
               </h2>
               {selectedClass?.topic && (
                   <p className="text-stone-500 text-sm italic">Topic: {selectedClass.topic}</p>
               )}
            </div>

            {/* Energy Selector - Minimalist */}
            <div className="grid grid-cols-3 gap-4">
               {[
                 { icon: ThumbsDown, label: "Low", color: "text-rose-500", activeBg: "bg-rose-50 ring-2 ring-rose-500" },
                 { icon: Meh, label: "Okay", color: "text-amber-500", activeBg: "bg-amber-50 ring-2 ring-amber-500" },
                 { icon: ThumbsUp, label: "High", color: "text-emerald-500", activeBg: "bg-emerald-50 ring-2 ring-emerald-500" },
               ].map((item, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setEnergy(idx)}
                   className={`p-4 rounded-xl border border-stone-200 bg-white flex flex-col items-center gap-3 transition-all ${
                     energy === idx ? item.activeBg : 'hover:bg-stone-50'
                   }`}
                 >
                   <item.icon className={`w-8 h-8 ${energy === idx ? item.color : 'text-stone-300'}`} />
                   <span className={`text-xs font-bold uppercase tracking-wider ${energy === idx ? 'text-stone-900' : 'text-stone-400'}`}>
                     {item.label}
                   </span>
                 </button>
               ))}
            </div>

            {/* Strategy Selection */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Effective Strategy</label>
              <div className="flex flex-wrap gap-2">
                 {["Proximity", "Think-Pair-Share", "Cold Call", "Wait Time", "None"].map((strat) => (
                   <button key={strat} className="px-4 py-2 rounded-full border border-stone-200 bg-white text-stone-600 text-sm font-medium hover:border-stone-900 hover:text-stone-900 focus:bg-stone-900 focus:text-white transition-all">
                     {strat}
                   </button>
                 ))}
              </div>
            </div>

            {/* Journal Input */}
             <div className="space-y-4">
              <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Field Notes</label>
              <textarea 
                placeholder="Ravi finally understood the diagram when I used the analogy..."
                className="w-full p-4 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 resize-none h-32 leading-relaxed"
              />
            </div>

            <button 
              onClick={() => setSubmitted(true)}
              disabled={energy === null}
              className="w-full py-4 rounded-lg bg-stone-900 text-white font-medium text-lg shadow-xl shadow-stone-900/10 hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Entry
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
              <Check className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-serif text-stone-900 mb-2">Logged.</h2>
            <p className="text-stone-500 text-center mb-12">
              Insight saved for <span className="font-bold text-stone-800">{selectedClass?.subject}</span>.
              <br/>Consistent reflection is the #1 driver of teacher growth.
            </p>
            
            <div className="w-full bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-stone-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-stone-600" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-900">Weekly Pulse</h3>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% vs last week</span>
              </div>
              
              <div className="h-40 flex items-end justify-between gap-2">
                {[40, 60, 35, 80, 55, 70, 90].map((h, i) => (
                  <div key={i} className="w-full bg-stone-50 rounded-t-sm relative group overflow-hidden">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                       className={`absolute bottom-0 left-0 right-0 rounded-t-sm ${i === 6 ? 'bg-stone-800' : 'bg-stone-300'}`}
                     />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>

            <Link href="/">
              <button className="text-stone-500 font-medium hover:text-stone-900 hover:underline underline-offset-4 transition-all">
                Return Home
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
