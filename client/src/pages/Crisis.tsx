import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, AlertCircle, Volume2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Crisis() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [stage, setStage] = useState<"idle" | "listening" | "processing" | "solution">("idle");

  const activateListening = () => {
    setStage("listening");
    setIsListening(true);
    // Simulate listening duration
    setTimeout(() => {
      setIsListening(false);
      setStage("processing");
      setTimeout(() => setStage("solution"), 1500);
    }, 2000);
  };

  const quickFilters = [
    { label: "Too Loud", icon: "🔊" },
    { label: "Fighting", icon: "🥊" },
    { label: "Crying", icon: "😢" },
    { label: "Sleeping", icon: "😴" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans max-w-md mx-auto relative overflow-hidden">
      
      {/* Background Pulse Animation for Crisis Mode */}
      <div className="absolute inset-0 bg-red-50/50 z-0 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex items-center justify-between">
        <Link href="/">
          <button className="p-2 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </Link>
        <span className="font-display font-bold text-red-600 tracking-wider text-sm uppercase">Crisis Mode</span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <main className="flex-1 flex flex-col relative z-10 px-6">
        
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center space-y-12 pb-12"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-display font-bold text-gray-900">What's happening?</h1>
                <p className="text-gray-500">Tap the button or whisper to describe.</p>
              </div>

              {/* The Big Red Button */}
              <button 
                onClick={activateListening}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/30 flex items-center justify-center transform active:scale-95 transition-all duration-200 group relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping opacity-20"></div>
                <Mic className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
              </button>

              {/* Quick Filters */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {quickFilters.map((filter) => (
                  <button 
                    key={filter.label}
                    onClick={() => {
                      setTranscript(filter.label);
                      setStage("processing");
                      setTimeout(() => setStage("solution"), 1500);
                    }}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors"
                  >
                    <span className="text-xl">{filter.icon}</span>
                    <span className="font-medium text-gray-700">{filter.label}</span>
                  </button>
                ))}
              </div>

              {/* Whisper Input */}
              <div className="w-full relative">
                <input 
                  type="text" 
                  placeholder="Or type silently (e.g., 'kid crying')"
                  className="w-full pl-4 pr-12 py-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-red-500/20 text-gray-900 placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setTranscript(e.currentTarget.value);
                      setStage("processing");
                      setTimeout(() => setStage("solution"), 1500);
                    }
                  }}
                />
                <button className="absolute right-3 top-3 p-1.5 rounded-lg bg-red-500 text-white">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {stage === "listening" && (
            <motion.div 
              key="listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="flex gap-2 items-center h-12 mb-8">
                 {[1,2,3,4,5].map((i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: [10, 32, 10] }}
                     transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                     className="w-2 bg-red-500 rounded-full"
                   />
                 ))}
              </div>
              <p className="text-xl font-medium text-gray-700">Listening...</p>
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-6"></div>
              <p className="text-lg text-gray-600">Analyzing situation...</p>
            </motion.div>
          )}

          {stage === "solution" && (
            <motion.div 
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col py-6 pb-24"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-red-500 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wide">Immediate Action</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold leading-tight">
                    Walk to the student. Kneel. Whisper: "I see you. Take a breath."
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Why this works</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Getting to eye level reduces threat. Whispering forces them to quiet down to hear you. Acknowledging emotion de-escalates immediately.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Next Steps</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        After class: Private check-in
                      </li>
                      <li className="flex gap-2">
                        <span className="text-red-500">•</span>
                        Inform counselor if behavior persists
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setStage("idle")}
                      className="flex-1 py-3 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Done
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-gray-800">
                      <Volume2 className="w-4 h-4" />
                      Read Aloud
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
