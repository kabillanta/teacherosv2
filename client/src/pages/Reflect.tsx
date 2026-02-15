import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, ThumbsUp, ThumbsDown, Meh, BarChart3, Check } from "lucide-react";
import { Link } from "wouter";

export default function Reflect() {
  const [submitted, setSubmitted] = useState(false);
  const [energy, setEnergy] = useState<number | null>(null);

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
             <span className="font-display font-bold text-purple-600 tracking-wider text-sm uppercase">Reflect Mode</span>
             <span className="text-xs text-gray-400">Post-Class Insight</span>
          </div>
          <div className="w-9" />
        </div>

        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-display font-bold text-gray-900">How did it go?</h2>
              <p className="text-gray-500">Quick check-in for Class 8 Biology</p>
            </div>

            {/* Energy Check */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 block text-center">Class Energy Level</label>
              <div className="flex justify-center gap-4">
                {[
                  { icon: ThumbsDown, label: "Low", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
                  { icon: Meh, label: "Okay", color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
                  { icon: ThumbsUp, label: "High", color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setEnergy(idx)}
                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all w-28 ${
                      energy === idx 
                        ? `${item.bg} ${item.border} scale-105 shadow-md` 
                        : "bg-white border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className={`w-8 h-8 ${energy === idx ? item.color : "text-gray-400"}`} />
                    <span className={`text-xs font-medium ${energy === idx ? "text-gray-900" : "text-gray-400"}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* What worked */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 block">What strategy worked best?</label>
              <div className="grid grid-cols-2 gap-3">
                 {["Proximity", "Think-Pair-Share", "Cold Call", "None"].map((strat) => (
                   <button key={strat} className="py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-purple-300 hover:bg-purple-50 focus:bg-purple-100 focus:border-purple-500 focus:text-purple-700 transition-colors">
                     {strat}
                   </button>
                 ))}
              </div>
            </div>

             {/* Notes */}
             <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Quick Note (Optional)</label>
              <textarea 
                placeholder="Ravi was struggling with diagrams..."
                className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500/20 resize-none h-24 text-sm"
              />
            </div>

            <button 
              onClick={() => setSubmitted(true)}
              className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
            >
              Save Reflection
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-100"
            >
              <Check className="w-12 h-12 text-green-600" />
            </motion.div>
            
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-gray-900">Great Job!</h2>
                <p className="text-gray-500 text-center max-w-xs mx-auto">
                Your reflection has been saved. You're building a great habit loop.
                </p>
            </div>
            
            <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 mt-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-50 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Weekly Insight</h3>
              </div>
              <div className="h-40 flex items-end justify-between gap-3 px-2">
                {[40, 60, 35, 80, 55, 70, 90].map((h, i) => (
                  <div key={i} className="w-full bg-gray-50 rounded-t-lg relative group overflow-hidden">
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${h}%` }}
                       transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                       className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-300 ${i === 6 ? 'bg-purple-600' : 'bg-purple-200'}`}
                     />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <Link href="/">
              <button className="w-full py-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                Back to Home
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
