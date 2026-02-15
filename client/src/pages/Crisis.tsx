import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, AlertCircle, Volume2, X, Ear } from "lucide-react";
import { Link } from "wouter";

export default function Crisis() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [stage, setStage] = useState<"idle" | "listening" | "processing" | "solution">("idle");

  const activateListening = () => {
    setStage("listening");
    setIsListening(true);
    // Simulate listening
    setTimeout(() => {
      setIsListening(false);
      setStage("processing");
      setTimeout(() => setStage("solution"), 1500);
    }, 2000);
  };

  const quickFilters = [
    { label: "Too Loud", emoji: "🔊" },
    { label: "Fighting", emoji: "🥊" },
    { label: "Crying", emoji: "😢" },
    { label: "Sleeping", emoji: "😴" },
  ];

  // Crisis mode needs to be IMMERSIVE and DISTRACTION FREE
  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col font-sans w-full md:max-w-md mx-auto relative overflow-hidden">
      
      {/* Escape Hatch */}
      <div className="absolute top-6 right-6 z-50">
        <Link href="/">
          <button className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </Link>
      </div>

      <main className="flex-1 flex flex-col relative z-10">
        
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col px-6 pt-24 pb-12"
            >
              <div className="mb-12">
                <h1 className="text-4xl font-serif text-stone-900 mb-2">Crisis Support</h1>
                <p className="text-stone-500 text-lg">Tap to speak or select a trigger.</p>
              </div>

              {/* The "Tactile" Button */}
              <div className="flex justify-center mb-12">
                <button 
                  onClick={activateListening}
                  className="w-48 h-48 rounded-full bg-[#E54D2E] shadow-[0_20px_60px_-15px_rgba(229,77,46,0.4)] flex flex-col items-center justify-center transform active:scale-95 transition-all duration-200 group relative border-4 border-[#FDFCF8] outline outline-1 outline-stone-200"
                >
                  <Mic className="w-12 h-12 text-white mb-2" />
                  <span className="text-white font-medium tracking-wide text-sm uppercase">Tap to Speak</span>
                </button>
              </div>

              {/* High Contrast Quick Filters */}
              <div className="grid grid-cols-2 gap-4">
                {quickFilters.map((filter) => (
                  <button 
                    key={filter.label}
                    onClick={() => {
                      setTranscript(filter.label);
                      setStage("processing");
                      setTimeout(() => setStage("solution"), 1500);
                    }}
                    className="flex items-center gap-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#E54D2E] hover:bg-red-50/30 transition-all group"
                  >
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{filter.emoji}</span>
                    <span className="font-semibold text-stone-700 text-lg">{filter.label}</span>
                  </button>
                ))}
              </div>

              {/* Discreet Input */}
              <div className="mt-auto pt-8">
                <div className="flex items-center gap-3">
                   <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type silently..."
                    className="flex-1 bg-transparent border-b border-stone-300 py-3 text-lg focus:outline-none focus:border-stone-900 placeholder:text-stone-300 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) {
                        setTranscript(inputValue);
                        setStage("processing");
                        setTimeout(() => setStage("solution"), 1500);
                        setInputValue("");
                      }
                    }}
                   />
                   <button 
                     onClick={() => {
                        if (inputValue.trim()) {
                          setTranscript(inputValue);
                          setStage("processing");
                          setTimeout(() => setStage("solution"), 1500);
                          setInputValue("");
                        }
                     }}
                     disabled={!inputValue.trim()}
                     className="p-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                     <Send className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "listening" && (
            <motion.div 
              key="listening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center bg-[#E54D2E] text-white"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mb-8"
              >
                <Ear className="w-16 h-16" />
              </motion.div>
              <h2 className="text-3xl font-serif">Listening...</h2>
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center bg-[#FDFCF8]"
            >
              <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin mb-6"></div>
              <p className="text-lg text-stone-500 font-serif italic">Consulting strategies...</p>
            </motion.div>
          )}

          {stage === "solution" && (
            <motion.div 
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col bg-[#FDFCF8]"
            >
              {/* Solution Header - High Contrast */}
              <div className="bg-[#2D3339] px-6 pt-16 pb-8 rounded-b-[2rem] shadow-xl z-20">
                <div className="flex items-center gap-2 mb-4 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Immediate Action</span>
                </div>
                <h2 className="text-3xl font-serif text-white leading-tight mb-6">
                  Walk to the student. Kneel. Whisper: "I see you. Take a breath."
                </h2>
                <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-5 py-3 rounded-full hover:bg-white/20 transition-colors">
                   <Volume2 className="w-5 h-5" />
                   <span className="font-medium">Read Aloud</span>
                </button>
              </div>
              
              <div className="flex-1 p-6 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest text-stone-400 uppercase">Why this works</h3>
                  <p className="text-stone-700 text-lg leading-relaxed border-l-2 border-stone-200 pl-4">
                    Eye-level contact reduces threat perception. Whispering creates a "conspiracy of calm" that forces the student to quiet down to hear you.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold tracking-widest text-stone-400 uppercase">Next Steps</h3>
                  <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
                     <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5" />
                        <span className="text-stone-600">Check in privately after class ends (5 mins)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2.5" />
                        <span className="text-stone-600">Document incident in Reflect mode later</span>
                      </li>
                     </ul>
                  </div>
                </div>

                <div className="pt-4">
                    <button 
                      onClick={() => setStage("idle")}
                      className="w-full py-4 rounded-xl bg-stone-100 text-stone-900 font-semibold hover:bg-stone-200 transition-colors"
                    >
                      Mark Resolved
                    </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
