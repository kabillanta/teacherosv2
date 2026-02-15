import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Check, School, User, Sparkles, BookOpen, ShieldAlert, BrainCircuit } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    schoolType: "CBSE",
    subjects: [] as string[]
  });

  const completeOnboarding = () => {
    localStorage.setItem("teacherOS_user", JSON.stringify(formData));
    // Also init dummy timetable if empty
    if (!localStorage.getItem("teacherOS_timetable")) {
        const dummySchedule = [
             { id: "1", time: "09:30", className: "8", section: "B", subject: formData.subjects[0] || "General", topic: "Introduction" }
        ];
        localStorage.setItem("teacherOS_timetable", JSON.stringify(dummySchedule));
    }
    setLocation("/");
  };

  const steps = [
    // Step 0: Welcome / Philosophy
    {
      content: (
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mb-4 shadow-xl">
             <Sparkles className="w-10 h-10 text-stone-50" />
          </div>
          <h1 className="font-serif text-4xl text-stone-900 leading-tight">
            TeacherOS
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-xs">
            Your calm companion for the chaos of the classroom.
          </p>
          
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs mt-8">
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Crisis</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Prep</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Reflect</span>
            </div>
          </div>
        </div>
      )
    },
    // Step 1: Name
    {
      content: (
        <div className="flex flex-col space-y-6 w-full">
           <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">First things first</label>
             <h2 className="font-serif text-3xl text-stone-900">What should we call you?</h2>
           </div>
           <div className="relative">
             <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-6 h-6" />
             <input 
               autoFocus
               type="text"
               placeholder="e.g. Priya"
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
               className="w-full pl-14 pr-4 py-5 text-xl font-medium bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent shadow-sm transition-all"
               onKeyDown={(e) => e.key === 'Enter' && formData.name && setStep(step + 1)}
             />
           </div>
           <p className="text-stone-400 text-sm">We'll use this to personalize your dashboard.</p>
        </div>
      )
    },
    // Step 2: Context
    {
      content: (
        <div className="flex flex-col space-y-6 w-full">
           <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Context is Key</label>
             <h2 className="font-serif text-3xl text-stone-900">Your School Board?</h2>
             <p className="text-stone-500">This helps us tailor lesson plans and strategies.</p>
           </div>
           
           <div className="grid grid-cols-1 gap-3">
             {["CBSE", "ICSE", "State Board", "IB / IGCSE"].map((board) => (
               <button
                 key={board}
                 onClick={() => {
                    setFormData({...formData, schoolType: board});
                    setStep(step + 1);
                 }}
                 className={`p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between group ${
                    formData.schoolType === board 
                    ? "bg-stone-900 text-white border-stone-900 shadow-md" 
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                 }`}
               >
                 <span>{board}</span>
                 {formData.schoolType === board && <Check className="w-5 h-5" />}
               </button>
             ))}
           </div>
        </div>
      )
    },
     // Step 3: Subject (Quick Pick)
    {
      content: (
        <div className="flex flex-col space-y-6 w-full">
           <div className="space-y-2">
             <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Final Touch</label>
             <h2 className="font-serif text-3xl text-stone-900">Primary Subject?</h2>
           </div>
           
           <div className="flex flex-wrap gap-2">
             {["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].map((subj) => (
               <button
                 key={subj}
                 onClick={() => {
                    const newSubjects = formData.subjects.includes(subj) 
                        ? formData.subjects.filter(s => s !== subj)
                        : [...formData.subjects, subj];
                    setFormData({...formData, subjects: newSubjects});
                 }}
                 className={`px-5 py-3 rounded-full border text-base font-medium transition-all ${
                    formData.subjects.includes(subj)
                    ? "bg-stone-900 text-white border-stone-900 shadow-md" 
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                 }`}
               >
                 {subj}
               </button>
             ))}
             
             {/* Other Option */}
             <button
                 onClick={() => {
                    // Toggle "Other" mode or add a placeholder
                    const hasCustom = formData.subjects.some(s => !["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].includes(s));
                    if (hasCustom) {
                        // Remove custom subjects
                        const predefOnly = formData.subjects.filter(s => ["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].includes(s));
                        setFormData({...formData, subjects: predefOnly});
                    } else {
                        // Add empty placeholder to trigger input mode
                        setFormData({...formData, subjects: [...formData.subjects, ""]});
                    }
                 }}
                 className={`px-5 py-3 rounded-full border text-base font-medium transition-all ${
                    formData.subjects.some(s => !["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].includes(s))
                    ? "bg-stone-900 text-white border-stone-900 shadow-md" 
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-400"
                 }`}
               >
                 Other
               </button>
           </div>
           
           {/* Custom Subject Input */}
           {formData.subjects.some(s => !["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].includes(s)) && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-2"
               >
                   <input 
                     type="text"
                     autoFocus
                     placeholder="Type your subject (e.g. Robotics)..."
                     value={formData.subjects.find(s => !["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].includes(s)) || ""}
                     onChange={(e) => {
                         const val = e.target.value;
                         const predef = formData.subjects.filter(s => ["Math", "Science", "English", "Social Studies", "Hindi", "Arts", "Computer"].includes(s));
                         setFormData({...formData, subjects: [...predef, val]});
                     }}
                     className="w-full p-4 bg-white border border-stone-300 rounded-xl font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-sm"
                   />
               </motion.div>
           )}

           <p className="text-stone-400 text-sm">Select all that apply.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-stone-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-50" />

        <div className="w-full max-w-md relative z-10 flex flex-col min-h-[500px]">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-12">
                {steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                            idx <= step ? "bg-stone-900" : "bg-stone-200"
                        }`} 
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                >
                    {steps[step].content}
                </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex justify-end">
                <button
                    onClick={() => {
                        if (step < steps.length - 1) {
                            setStep(step + 1);
                        } else {
                            completeOnboarding();
                        }
                    }}
                    disabled={step === 1 && !formData.name}
                    className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <span>{step === steps.length - 1 ? "Get Started" : "Continue"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    </div>
  );
}
