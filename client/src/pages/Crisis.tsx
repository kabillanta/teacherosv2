import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, AlertCircle, Volume2, X, Ear, MicOff, Loader2 } from "lucide-react";
import { Link } from "wouter";

type Stage = "idle" | "listening" | "processing" | "solution";

export default function Crisis() {
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState("");
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/crisis`);

    ws.onopen = () => {
      console.log("Crisis WS connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "status" && data.status === "processing") {
        setStage("processing");
      } else if (data.type === "chunk") {
        setStage("solution");
        setResponse((prev) => prev + data.text);
      } else if (data.type === "done") {
        // response complete
      } else if (data.type === "error") {
        setResponse(data.message);
        setStage("solution");
      }
    };

    ws.onclose = () => {
      console.log("Crisis WS disconnected");
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connectWebSocket();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsRecognitionSupported(false);
    }

    return () => {
      wsRef.current?.close();
      recognitionRef.current?.abort();
    };
  }, [connectWebSocket]);

  const sendQuery = useCallback((text: string) => {
    if (!text.trim()) return;
    setTranscript(text);
    setResponse("");

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connectWebSocket();
      setTimeout(() => {
        wsRef.current?.send(JSON.stringify({ type: "crisis_query", text }));
      }, 500);
    } else {
      wsRef.current.send(JSON.stringify({ type: "crisis_query", text }));
    }
    setStage("processing");
  }, [connectWebSocket]);

  const activateListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    setStage("listening");
    setTranscript("");

    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setTranscript(finalTranscript || interim);
    };

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        sendQuery(finalTranscript.trim());
      } else {
        setStage("idle");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setIsRecognitionSupported(false);
      }
      setStage("idle");
    };

    recognition.start();
  }, [sendQuery]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const handleTextSubmit = useCallback(() => {
    if (inputValue.trim()) {
      sendQuery(inputValue.trim());
      setInputValue("");
    }
  }, [inputValue, sendQuery]);

  const handleQuickFilter = useCallback((label: string) => {
    sendQuery(`Students are ${label.toLowerCase()} in my classroom. What should I do immediately?`);
  }, [sendQuery]);

  const resetCrisis = useCallback(() => {
    setStage("idle");
    setTranscript("");
    setResponse("");
    setInputValue("");
  }, []);

  const quickFilters = [
    { label: "Too Loud", emoji: "🔊" },
    { label: "Fighting", emoji: "🥊" },
    { label: "Crying", emoji: "😢" },
    { label: "Sleeping", emoji: "😴" },
  ];

  const renderResponse = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) => {
        if (j % 2 === 1) {
          return <strong key={j} className="font-bold text-stone-900">{part}</strong>;
        }
        return <span key={j}>{part}</span>;
      });

      if (line.startsWith('- ')) {
        return <p key={i} className="pl-4 before:content-['•'] before:mr-2 before:text-stone-400">{rendered.map((r, idx) => idx === 0 ? <span key="bullet">{String(parts[0]).replace(/^- /, '')}</span> : r)}</p>;
      }

      return <p key={i} className={line.trim() === '' ? 'h-2' : ''}>{rendered}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col font-sans w-full md:max-w-md mx-auto relative overflow-hidden">
      
      <div className="absolute top-6 right-6 z-50">
        <Link href="/">
          <button data-testid="button-crisis-close" className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors">
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
                <p className="text-stone-500 text-lg">
                  {isRecognitionSupported 
                    ? "Tap to speak or select a trigger." 
                    : "Type your situation or select a trigger."}
                </p>
              </div>

              <div className="flex justify-center mb-12">
                <button 
                  onClick={activateListening}
                  data-testid="button-tap-to-speak"
                  disabled={!isRecognitionSupported}
                  className={`w-48 h-48 rounded-full shadow-[0_20px_60px_-15px_rgba(229,77,46,0.4)] flex flex-col items-center justify-center transform active:scale-95 transition-all duration-200 group relative border-4 border-[#FDFCF8] outline outline-1 outline-stone-200 ${
                    isRecognitionSupported 
                      ? 'bg-[#E54D2E]' 
                      : 'bg-stone-400 cursor-not-allowed'
                  }`}
                >
                  {isRecognitionSupported ? (
                    <Mic className="w-12 h-12 text-white mb-2" />
                  ) : (
                    <MicOff className="w-12 h-12 text-white mb-2" />
                  )}
                  <span className="text-white font-medium tracking-wide text-sm uppercase">
                    {isRecognitionSupported ? "Tap to Speak" : "Mic Unavailable"}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickFilters.map((filter) => (
                  <button 
                    key={filter.label}
                    data-testid={`button-filter-${filter.label.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={() => handleQuickFilter(filter.label)}
                    className="flex items-center gap-4 p-5 rounded-xl bg-white border border-stone-200 shadow-sm hover:border-[#E54D2E] hover:bg-red-50/30 transition-all group"
                  >
                    <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{filter.emoji}</span>
                    <span className="font-semibold text-stone-700 text-lg">{filter.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <div className="flex items-center gap-3">
                   <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type silently..."
                    data-testid="input-crisis-text"
                    className="flex-1 bg-transparent border-b border-stone-300 py-3 text-lg focus:outline-none focus:border-stone-900 placeholder:text-stone-300 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTextSubmit();
                    }}
                   />
                   <button 
                     onClick={handleTextSubmit}
                     disabled={!inputValue.trim()}
                     data-testid="button-crisis-send"
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
              className="flex-1 flex flex-col items-center justify-center bg-[#E54D2E] text-white px-6"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mb-8"
              >
                <Ear className="w-16 h-16" />
              </motion.div>
              <h2 className="text-3xl font-serif mb-4">Listening...</h2>
              {transcript && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/80 text-lg text-center max-w-xs italic"
                >
                  "{transcript}"
                </motion.p>
              )}
              <button
                onClick={stopListening}
                data-testid="button-stop-listening"
                className="mt-8 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium hover:bg-white/30 transition-colors"
              >
                Stop & Send
              </button>
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
              <Loader2 className="w-12 h-12 text-stone-400 animate-spin mb-6" />
              <p className="text-lg text-stone-500 font-serif italic">Consulting strategies...</p>
              {transcript && (
                <p className="text-stone-400 text-sm mt-4 text-center max-w-xs">
                  "{transcript}"
                </p>
              )}
            </motion.div>
          )}

          {stage === "solution" && (
            <motion.div 
              key="solution"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col bg-[#FDFCF8]"
            >
              <div className="bg-[#2D3339] px-6 pt-16 pb-8 rounded-b-[2rem] shadow-xl z-20">
                <div className="flex items-center gap-2 mb-4 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">AI Crisis Support</span>
                </div>
                {transcript && (
                  <p className="text-white/60 text-sm mb-3 italic">"{transcript}"</p>
                )}
              </div>
              
              <div ref={responseRef} className="flex-1 p-6 space-y-4 overflow-y-auto pb-32">
                <div 
                  className="text-stone-700 text-lg leading-relaxed space-y-1"
                  data-testid="text-crisis-response"
                >
                  {renderResponse(response)}
                </div>
                
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-8 space-y-3"
                  >
                    <button 
                      onClick={resetCrisis}
                      data-testid="button-new-crisis"
                      className="w-full py-4 rounded-xl bg-stone-100 text-stone-900 font-semibold hover:bg-stone-200 transition-colors"
                    >
                      New Crisis
                    </button>
                    <Link href="/">
                      <button 
                        data-testid="button-mark-resolved"
                        className="w-full py-4 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
