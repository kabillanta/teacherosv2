import { useState } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Book, School, Wifi, Monitor, Check, ChevronRight, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "Priya Sharma",
    schoolType: "CBSE",
    subjects: ["Biology", "Chemistry"],
    classes: ["8", "9", "10"],
    resources: ["Smartboard", "Internet"]
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleSelection = (field: keyof typeof formData, value: string) => {
    // @ts-ignore
    const current = formData[field] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  return (
    <Layout>
      <div className="p-6 pt-12 min-h-screen pb-32">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-stone-100 transition-colors text-stone-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <div className="text-center">
             <h1 className="font-serif text-xl text-stone-900">Teacher Profile</h1>
             <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Your Classroom Context</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-500'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          
          {/* Personal Identity Card */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            
            <div className="relative z-10 flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center border-2 border-white shadow-sm">
                <User className="w-8 h-8 text-stone-400" />
              </div>
              <div>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="font-serif text-2xl font-bold text-stone-900 bg-transparent border-b border-stone-300 focus:border-stone-900 focus:outline-none w-full"
                  />
                ) : (
                  <h2 className="font-serif text-2xl font-bold text-stone-900">{formData.name}</h2>
                )}
                <p className="text-stone-500 text-sm">Senior Teacher • 8 Years Exp.</p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
               <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Board</span>
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-stone-600" />
                    <span className="font-medium text-stone-800">{formData.schoolType}</span>
                  </div>
               </div>
               <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Classes</span>
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-stone-600" />
                    <span className="font-medium text-stone-800">{formData.classes.join(", ")}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Context Settings */}
          <div className="space-y-6">
            
            {/* Subjects */}
            <section>
               <h3 className="font-serif text-lg text-stone-900 mb-3 flex items-center gap-2">
                 <Book className="w-4 h-4 text-stone-400" />
                 Subjects Taught
               </h3>
               <div className="flex flex-wrap gap-2">
                 {["Math", "Biology", "Physics", "Chemistry", "English", "History"].map((subj) => {
                   const isActive = formData.subjects.includes(subj);
                   return (
                     <button 
                       key={subj}
                       onClick={() => isEditing && toggleSelection("subjects", subj)}
                       disabled={!isEditing}
                       className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                         isActive 
                           ? "bg-stone-800 text-white border-stone-800 shadow-md" 
                           : "bg-white border-stone-200 text-stone-500"
                       } ${!isEditing && !isActive ? 'opacity-50' : ''}`}
                     >
                       {subj}
                     </button>
                   )
                 })}
               </div>
            </section>

            {/* Classroom Resources - CRITICAL for AI Advice */}
            <section>
               <h3 className="font-serif text-lg text-stone-900 mb-3 flex items-center gap-2">
                 <Monitor className="w-4 h-4 text-stone-400" />
                 Available Resources
               </h3>
               <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                 We customize advice based on what you have. No internet? We won't suggest YouTube.
               </p>
               
               <div className="grid grid-cols-2 gap-3">
                 {[
                   { id: "Smartboard", icon: Monitor, label: "Smartboard" },
                   { id: "Internet", icon: Wifi, label: "Reliable WiFi" },
                   { id: "Projector", icon: Monitor, label: "Projector" },
                   { id: "Chalkboard", icon: School, label: "Chalkboard Only" }
                 ].map((res) => {
                   const isActive = formData.resources.includes(res.id);
                   return (
                     <button 
                        key={res.id}
                        onClick={() => isEditing && toggleSelection("resources", res.id)}
                        disabled={!isEditing}
                        className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${
                          isActive 
                            ? "bg-emerald-50 border-emerald-200 ring-1 ring-emerald-500" 
                            : "bg-white border-stone-200"
                        } ${!isEditing && !isActive ? 'opacity-50' : ''}`}
                     >
                       <div className={`p-2 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                         <res.icon className="w-4 h-4" />
                       </div>
                       <span className={`font-medium ${isActive ? 'text-stone-900' : 'text-stone-500'}`}>
                         {res.label}
                       </span>
                     </button>
                   )
                 })}
               </div>
            </section>

          </div>

          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-24"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="w-full py-4 rounded-lg bg-stone-900 text-white font-medium text-lg shadow-xl hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Changes
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
}
