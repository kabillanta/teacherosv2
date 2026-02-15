import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Zap, BookOpen, BarChart3, Mic, Search, Bell } from "lucide-react";
// @ts-ignore
import logo from "@/assets/logo.png";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="p-6 pt-12 space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TeacherOS" className="w-10 h-10 rounded-xl shadow-sm object-cover" />
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900 leading-tight">Good Morning,</h1>
              <p className="text-sm text-gray-500 font-medium">Ready for Class 8 Biology?</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-white border border-gray-200 shadow-sm relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </header>

        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary text-white p-5 rounded-2xl shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium backdrop-blur-sm">Next Class</span>
              <span className="text-xs font-medium opacity-80">09:30 AM</span>
            </div>
            <h2 className="text-2xl font-display font-bold mb-1">Biology</h2>
            <p className="opacity-90 text-sm mb-4">Chapter 4: Cell Structure</p>
            
            <Link href="/prep">
              <button className="w-full bg-white text-primary font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <BookOpen className="w-4 h-4" />
                Start 30s Prep
              </button>
            </Link>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/crisis">
            <motion.div variants={item} className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 relative group overflow-hidden h-40 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-16 h-16 text-red-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Crisis Mode</h3>
                <p className="text-xs text-gray-500 mt-1">Help me right now</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/reflect">
            <motion.div variants={item} className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 relative group overflow-hidden h-40 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-16 h-16 text-purple-500" />
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Reflect Mode</h3>
                <p className="text-xs text-gray-500 mt-1">Post-class insights</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Weekly Insight */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <span className="text-lg">🌱</span>
            </div>
            <h3 className="font-semibold text-gray-900">Weekly Growth</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            You used "Proximity" strategy 4 times this week. Classroom disruptions are down by <span className="text-green-600 font-bold">12%</span>.
          </p>
        </motion.div>

      </div>
    </Layout>
  );
}
