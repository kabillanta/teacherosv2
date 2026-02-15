import { useState } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Target, Lightbulb, BookOpen, Layers } from "lucide-react";
import { Link } from "wouter";

interface PrepResult {
  answer: string;
  key_points: string[];
  sources: string[];
  suggested_followups: string[];
}

function renderAnswer(text: string) {
  return text.split('\n').map((line: string, i: number) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-2" />;

    // Bold text
    const parts = trimmed.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part: string, j: number) =>
      j % 2 === 1
        ? <strong key={j} className="font-semibold text-stone-900">{part}</strong>
        : <span key={j}>{part}</span>
    );

    // Numbered list
    if (/^\d+[.)]\s/.test(trimmed)) {
      return <p key={i} className="pl-2 py-0.5">{rendered}</p>;
    }
    // Bullet
    if (/^[-•*]\s/.test(trimmed)) {
      return (
        <p key={i} className="pl-4 py-0.5 flex gap-2">
          <span className="text-stone-400">•</span>
          <span>{rendered}</span>
        </p>
      );
    }
    // Heading
    if (trimmed.startsWith('#')) {
      const headingText = trimmed.replace(/^#+\s*/, '');
      return <p key={i} className="font-bold text-stone-900 mt-3 mb-1">{headingText}</p>;
    }

    return <p key={i} className="py-0.5">{rendered}</p>;
  });
}

export default function Prep() {
  const [step, setStep] = useState<"input" | "generating" | "result">("input");
  
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    class: ""
  });

  const [result, setResult] = useState<PrepResult | null>(null);
  const [error, setError] = useState("");

  const generatePrep = async () => {
    setStep("generating");
    setError("");

    try {
      const res = await fetch("/api/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          subject: formData.subject,
          topic: formData.topic,
          class: formData.class,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate lesson plan");
      }

      const data = await res.json();

      // The Lyzr API returns { response: "{ JSON string }" }
      let parsed: PrepResult;
      const rawResponse = data.response || data;

      if (typeof rawResponse === "string") {
        try {
          parsed = JSON.parse(rawResponse);
        } catch {
          parsed = { answer: rawResponse, key_points: [], sources: [], suggested_followups: [] };
        }
      } else {
        parsed = rawResponse;
      }

      // Ensure all fields exist
      parsed.answer = parsed.answer || "";
      parsed.key_points = parsed.key_points || [];
      parsed.sources = parsed.sources || [];
      parsed.suggested_followups = parsed.suggested_followups || [];

      setResult(parsed);
      setStep("result");
    } catch (err: any) {
      console.error("Prep generation error:", err);
      setError(err.message || "Something went wrong");
      setStep("input");
    }
  };

  return (
    <Layout>
      <div className="p-5 pt-8 md:p-6 md:pt-12 min-h-screen pb-32">
        
        {/* Navigation Header */}
        <div className="flex items-center mb-8">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="ml-4">
             <h1 className="font-serif text-2xl text-stone-900">Lesson Prep</h1>
             <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">NCF-Aligned Planner</p>
          </div>
        </div>

        {step === "input" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Subject</label>
                <select 
                  className="w-full p-4 rounded-none border-b border-stone-200 bg-transparent text-xl font-serif text-stone-900 focus:outline-none focus:border-stone-900 transition-colors appearance-none"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  value={formData.subject}
                >
                  <option value="" disabled>Select Subject</option>
                  <option value="Biology">Biology</option>
                  <option value="Math">Mathematics</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Topic</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cell Structure"
                  className="w-full p-4 pl-0 rounded-none border-b border-stone-200 bg-transparent text-xl font-serif text-stone-900 focus:outline-none focus:border-stone-900 placeholder:text-stone-300 transition-colors"
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  value={formData.topic}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-stone-500 uppercase tracking-wide">Class Level</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {["6", "7", "8", "9", "10", "11", "12"].map((cls) => (
                    <button 
                      key={cls}
                      onClick={() => setFormData({...formData, class: cls})}
                      className={`w-12 h-12 rounded-full font-medium border transition-all flex-shrink-0 flex items-center justify-center ${
                        formData.class === cls 
                          ? "bg-stone-900 text-white border-stone-900" 
                          : "bg-white border-stone-200 text-stone-500 hover:border-stone-400"
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={generatePrep}
              disabled={!formData.topic || !formData.subject}
              className="w-full py-4 mt-8 rounded-lg bg-stone-900 text-white font-medium text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10"
            >
              <Sparkles className="w-5 h-5" />
              Generate Plan
            </button>
          </motion.div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-8">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-stone-100 border-t-stone-900 rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-serif text-stone-900">Consulting NCF 2023...</h3>
              <div className="flex flex-col gap-2 text-stone-500 text-sm">
                <span className="animate-pulse">Searching knowledge base...</span>
                <span className="animate-pulse delay-75">Generating teaching strategy...</span>
              </div>
            </div>
          </div>
        )}

        {step === "result" && result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="border-b border-stone-200 pb-6">
               <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">Lesson Plan</span>
               <h2 className="text-3xl font-serif text-stone-900 mt-2 leading-tight">{formData.topic}</h2>
               <div className="flex gap-3 mt-3">
                  {formData.class && (
                    <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">Class {formData.class}</span>
                  )}
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">{formData.subject}</span>
                  <span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-medium text-stone-600">NCF-Aligned</span>
               </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
              
              {/* Main Teaching Strategy (from answer) */}
              {result.answer && (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-900">Teaching Strategy</h3>
                  </div>
                  <div className="text-stone-700 leading-relaxed text-sm space-y-0.5">
                    {renderAnswer(result.answer)}
                  </div>
                </div>
              )}

              {/* Key Points */}
              {result.key_points.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-900">Key Points</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.key_points.map((point: string, i: number) => (
                      <li key={i} className="flex gap-3 text-stone-700 text-sm">
                        <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">✦</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* NCF Sources */}
              {result.sources.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-900">NCF Sources</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.sources.map((source: string, i: number) => (
                      <li key={i} className="text-stone-600 text-sm flex gap-2">
                        <span className="text-emerald-500 flex-shrink-0">📄</span>
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explore Further / Follow-ups */}
              {result.suggested_followups.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-stone-900">Explore Further</h3>
                  </div>
                  <div className="space-y-3">
                    {result.suggested_followups.map((q: string, i: number) => (
                      <div key={i} className={i > 0 ? "border-t border-stone-100 pt-3" : ""}>
                        <p className="text-stone-700 text-sm flex gap-2">
                          <span className="text-purple-400 flex-shrink-0">→</span>
                          <span>{q}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => { setStep("input"); setResult(null); }}
                className="flex-1 py-4 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
              >
                New Plan
              </button>
              <Link href="/">
                <button className="flex-1 py-4 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Start Class
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
