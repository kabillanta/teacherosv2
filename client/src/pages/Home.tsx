import { Link } from "wouter";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Zap, BookOpen, BarChart3, Bell, ArrowRight, Quote } from "lucide-react";
// @ts-ignore
import logo from "@/assets/logo.png";

export default function Home() {
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
            <p className="text-stone-500 font-sans text-base">You have Class 8 Biology at 9:30 AM.</p>
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
          <Link href="/prep">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-wide mb-4 text-[#FDFCF8]/90 border border-white/10">
                Up Next
              </span>
              <h2 className="text-2xl font-serif mb-2">Cell Structure</h2>
              <p className="text-[#FDFCF8]/70 text-sm mb-6 max-w-[80%]">
                Students often confuse cell walls with membranes. We have a 30s analogy to fix this.
              </p>
              
              <div className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all text-white">
                Review Plan <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
          
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
