import { Link } from "wouter";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Zap, BookOpen, BarChart3, Bell, ArrowRight, Quote, User, Edit2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
// @ts-ignore
import logo from "@/assets/logo.png";

export default function Home() {
  const [upNext, setUpNext] = useState({
    title: "Cell Structure",
    desc: "Students often confuse cell walls with membranes. We have a 30s analogy to fix this.",
    time: "9:30 AM"
  });

  const [editForm, setEditForm] = useState(upNext);
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Primary Action / Insight */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2D3339] text-[#FDFCF8] p-6 rounded-2xl shadow-xl relative overflow-hidden group cursor-pointer"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wide text-[#FDFCF8]/90 border border-white/10">
                Up Next • {upNext.time}
              </span>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                   <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                     <Edit2 className="w-4 h-4" />
                   </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif">Update Schedule</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-500">Next Class Topic</label>
                      <input 
                        className="w-full p-3 border border-stone-200 rounded-lg" 
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-500">Insight/Hook</label>
                      <textarea 
                        className="w-full p-3 border border-stone-200 rounded-lg" 
                        value={editForm.desc}
                        onChange={(e) => setEditForm({...editForm, desc: e.target.value})}
                      />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-stone-500">Time</label>
                      <input 
                        type="time"
                        className="w-full p-3 border border-stone-200 rounded-lg" 
                        value={editForm.time}
                        onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        setUpNext(editForm);
                        setIsOpen(false);
                      }}
                      className="w-full py-3 bg-stone-900 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <Link href="/prep">
              <div>
                <h2 className="text-2xl font-serif mb-2">{upNext.title}</h2>
                <p className="text-[#FDFCF8]/70 text-sm mb-6 max-w-[80%]">
                  {upNext.desc}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all text-white">
                  Review Plan <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
          
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
