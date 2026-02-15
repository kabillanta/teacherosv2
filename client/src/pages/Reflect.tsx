import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ThumbsUp, ThumbsDown, Meh, TrendingUp, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Reflect() {
  const [submitted, setSubmitted] = useState(false);
  const [energy, setEnergy] = useState<number | null>(null);

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
            <div className="space-y-2">
               <h2 className="text-xl font-serif text-stone-900">How was the energy in Class 8?</h2>
               <p className="text-stone-500">Be honest. It helps the algorithm.</p>
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
              className="w-full py-4 rounded-lg bg-stone-900 text-white font-medium text-lg shadow-xl shadow-stone-900/10 hover:bg-stone-800 transition-all active:scale-[0.98]"
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
              That's 4 reflections this week. Consistent reflection is the #1 driver of teacher growth.
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
