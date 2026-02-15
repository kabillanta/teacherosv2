import { Link } from "wouter";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Zap, BookOpen, BarChart3, Bell, ArrowRight, Quote, User, Edit2, Check, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
// @ts-ignore
import logo from "@/assets/logo.png";

type ClassSession = {
  id: string;
  time: string;
  className: string;
  subject: string;
  topic?: string;
};

export default function Home() {
  const [nextClass, setNextClass] = useState<ClassSession | null>(null);
  const [topicInput, setTopicInput] = useState("");
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  // Simulate fetching the "Next Class" from the profile timetable
  useEffect(() => {
    const saved = localStorage.getItem("teacherOS_timetable");
    if (saved) {
      const schedule: ClassSession[] = JSON.parse(saved);
      // For this prototype, we'll just grab the first one that doesn't have a topic, or just the first one.
      // In a real app, we'd compare with Current Time.
      // Let's find the first class.
      if (schedule.length > 0) {
          // Let's try to find a class without a topic to demonstrate the "Add Topic" flow
          const incomplete = schedule.find(s => !s.topic);
          setNextClass(incomplete || schedule[0]);
      }
    } else {
        // Fallback default if no profile set up yet
        setNextClass({
            id: "default",
            time: "09:30",
            className: "8-B",
            subject: "Biology",
            topic: "Cell Structure" 
        })
    }
  }, []);

  const saveTopic = () => {
    if (!nextClass) return;
    
    // Update local state
    const updated = { ...nextClass, topic: topicInput };
    setNextClass(updated);
    setIsAddingTopic(false);

    // Update global storage so Profile syncs
    const saved = localStorage.getItem("teacherOS_timetable");
    if (saved) {
        const schedule: ClassSession[] = JSON.parse(saved);
        const newSchedule = schedule.map(s => s.id === nextClass.id ? { ...s, topic: topicInput } : s);
        localStorage.setItem("teacherOS_timetable", JSON.stringify(newSchedule));
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="p-8 pt-12 space-y-10">
        
        {/* Minimal Header */}
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif text-stone-900 leading-none">Good Morning,</h1>
            <Link href="/profile">
               <div className="flex items-center gap-2 cursor-pointer group">
                  <p className="text-stone-500 font-sans text-base group-hover:text-stone-700 transition-colors">Priya Sharma</p>
                  <User className="w-4 h-4 text-stone-400 group-hover:text-stone-600" />
               </div>
            </Link>
          </div>
          <button className="p-2 -mr-2 text-stone-400 hover:text-stone-600 transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FDFCF8]"></span>
          </button>
        </header>

        {/* Dynamic Up Next Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer transition-all ${
              !nextClass?.topic ? 'bg-[#E54D2E]' : 'bg-[#2D3339]'
          }`}
        >
          {nextClass ? (
              <div className="relative z-10 text-[#FDFCF8]">
                <div className="flex justify-between items-start mb-4">
                   <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wide text-[#FDFCF8]/90 border border-white/10">
                    Up Next • {nextClass.time}
                  </span>
                  {!nextClass.topic && (
                      <span className="animate-pulse flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">
                          <AlertCircle className="w-3 h-3" /> Action Needed
                      </span>
                  )}
                </div>
                
                {nextClass.topic ? (
                    <Link href="/prep">
                      <div>
                        <h2 className="text-2xl font-serif mb-2">{nextClass.subject}: {nextClass.topic}</h2>
                        <p className="text-[#FDFCF8]/70 text-sm mb-6 max-w-[90%]">
                           Class {nextClass.className}. Tap to review the generated lesson plan and hook.
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all text-white">
                          Review Plan <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                ) : (
                    <div>
                        <h2 className="text-2xl font-serif mb-2">{nextClass.subject} • Class {nextClass.className}</h2>
                        <p className="text-[#FDFCF8]/90 text-sm mb-6 max-w-[90%] font-medium">
                           You haven't planned this lesson yet. What are you teaching?
                        </p>
                        
                        <Dialog open={isAddingTopic} onOpenChange={setIsAddingTopic}>
                            <DialogTrigger asChild>
                                <button className="w-full bg-white text-[#E54D2E] py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-stone-50 transition-colors">
                                    <Plus className="w-4 h-4" /> Add Topic & Generate
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="font-serif">Plan Lesson for {nextClass.subject}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-stone-500">What is the topic?</label>
                                        <input 
                                            placeholder="e.g. Photosynthesis, Trigonometry..."
                                            className="w-full p-3 border border-stone-200 rounded-lg text-lg font-serif" 
                                            value={topicInput}
                                            onChange={(e) => setTopicInput(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <button 
                                        onClick={saveTopic}
                                        disabled={!topicInput}
                                        className="w-full py-3 bg-stone-900 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Zap className="w-4 h-4" /> Generate 30s Plan
                                    </button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
              </div>
          ) : (
              <div className="relative z-10 text-white/50 text-center py-8">
                  <p>No upcoming classes in schedule.</p>
                  <Link href="/profile">
                      <button className="mt-4 text-white underline">Add to Timetable</button>
                  </Link>
              </div>
          )}
          
          {/* Subtle Texture */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
        </motion.div>

        {/* Modes Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-widest text-stone-400 uppercase">Tools</h3>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4"
          >
            {/* Crisis Card - Subtle but distinct */}
            <Link href="/crisis">
              <motion.div variants={item} className="paper-card p-5 rounded-xl border-l-4 border-l-red-500 hover:border-l-red-600 cursor-pointer h-40 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Zap className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-red-700 transition-colors">Crisis</h3>
                  <p className="text-xs text-stone-500 mt-1">Immediate classroom support</p>
                </div>
              </motion.div>
            </Link>

            {/* Reflect Card */}
            <Link href="/reflect">
              <motion.div variants={item} className="paper-card p-5 rounded-xl border-l-4 border-l-purple-500 hover:border-l-purple-600 cursor-pointer h-40 flex flex-col justify-between group">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-purple-700 transition-colors">Reflect</h3>
                  <p className="text-xs text-stone-500 mt-1">Log insights & habits</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Weekly Quote/Insight */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-stone-200 pt-8"
        >
          <Quote className="w-8 h-8 text-stone-200 mb-4" />
          <blockquote className="text-lg font-serif italic text-stone-600 leading-relaxed">
            "Education is not the filling of a pail, but the lighting of a fire."
          </blockquote>
          <cite className="block mt-3 text-sm font-medium text-stone-400 not-italic">— W.B. Yeats</cite>
        </motion.div>

      </div>
    </Layout>
  );
}
