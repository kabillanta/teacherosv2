import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Book, School, Wifi, Monitor, Check, Settings, Users, Calendar, Plus, Trash2, Clock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Simple type for our timetable
type ClassSession = {
  id: string;
  time: string;
  className: string;
  section?: string;
  subject: string;
  topic?: string; // Optional, can be added later from Home
};

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "Priya Sharma",
    schoolType: "CBSE",
    subjects: ["Biology", "Chemistry"],
    classes: ["8", "9", "10"],
    resources: ["Smartboard", "Internet"]
  });

  const [timetable, setTimetable] = useState<ClassSession[]>([
    { id: "1", time: "09:30", className: "8", section: "B", subject: "Biology", topic: "Cell Structure" },
    { id: "2", time: "11:00", className: "10", section: "A", subject: "Chemistry" }, // No topic yet
    { id: "3", time: "14:00", className: "9", section: "C", subject: "Biology" }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClass, setNewClass] = useState({ time: "", className: "", section: "", subject: "" });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("teacherOS_timetable");
    if (saved) {
      setTimetable(JSON.parse(saved));
    }
  }, []);

  // Save to local storage whenever changed
  useEffect(() => {
    localStorage.setItem("teacherOS_timetable", JSON.stringify(timetable));
  }, [timetable]);

  const toggleSelection = (field: keyof typeof formData, value: string) => {
    // @ts-ignore
    const current = formData[field] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    if (field === "classes") {
        updated.sort((a, b) => {
            if (a === "KG") return -1;
            if (b === "KG") return 1;
            return parseInt(a) - parseInt(b);
        });
    }
    
    setFormData({ ...formData, [field]: updated });
  };

  const addClass = () => {
    if (!newClass.time || !newClass.className || !newClass.subject) return;
    const session: ClassSession = {
      id: Date.now().toString(),
      ...newClass
    };
    // Sort by time
    const updated = [...timetable, session].sort((a, b) => a.time.localeCompare(b.time));
    setTimetable(updated);
    setNewClass({ time: "", className: "", section: "", subject: "" });
    setIsAddingClass(false);
  };

  const removeClass = (id: string) => {
    setTimetable(timetable.filter(t => t.id !== id));
  };

  const classOptions = ["KG", ...Array.from({length: 12}, (_, i) => (i + 1).toString())];

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
             <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Your Context</p>
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
              <div className="flex-1">
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

          {/* Timetable Section - NEW */}
          <section className="bg-stone-50 p-6 rounded-xl border border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-400" />
                Daily Schedule
              </h3>
              <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 shadow-sm transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#FDFCF8] border-stone-200 shadow-2xl sm:max-w-[400px] w-[95%] rounded-2xl gap-6">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-stone-900">Add Class Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Time</label>
                         <input 
                           type="time" 
                           className="w-full p-4 bg-white border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:border-stone-900 transition-colors appearance-none"
                           value={newClass.time}
                           onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Class</label>
                         <div className="flex gap-2">
                           <div className="relative flex-1">
                             <select 
                               className="w-full p-4 bg-white border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:border-stone-900 transition-colors appearance-none"
                               value={newClass.className}
                               onChange={(e) => setNewClass({...newClass, className: e.target.value})}
                             >
                                <option value="">Grade</option>
                                {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                               <ChevronRight className="w-4 h-4 rotate-90" />
                             </div>
                           </div>
                           <div className="w-24">
                             <input 
                               placeholder="Sec"
                               className="w-full p-4 bg-white border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:border-stone-900 transition-colors text-center"
                               value={newClass.section}
                               onChange={(e) => setNewClass({...newClass, section: e.target.value.toUpperCase()})}
                               maxLength={2}
                             />
                           </div>
                         </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Subject</label>
                       <div className="relative">
                         <select 
                           className="w-full p-4 bg-white border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none focus:border-stone-900 transition-colors appearance-none"
                           value={newClass.subject}
                           onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                         >
                            <option value="">Select</option>
                            {formData.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                           <ChevronRight className="w-4 h-4 rotate-90" />
                         </div>
                       </div>
                    </div>
                    <button 
                      onClick={addClass}
                      className="w-full py-4 bg-stone-900 text-white rounded-xl font-medium text-lg shadow-xl shadow-stone-900/10 hover:bg-stone-800 transition-all active:scale-[0.98]"
                    >
                      Add to Schedule
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {timetable.map((session, index) => (
                <div key={session.id} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-stone-200 shadow-sm group">
                  <div className="flex flex-col items-center min-w-[3rem]">
                    <span className="text-sm font-bold text-stone-900">{session.time}</span>
                    <div className="h-8 w-px bg-stone-200 my-1 group-last:hidden"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-stone-800">{session.subject}</span>
                      <span className="text-xs px-2 py-0.5 bg-stone-100 rounded text-stone-500 font-medium">
                        Class {session.className}{session.section ? `-${session.section}` : ''}
                      </span>
                    </div>
                    {session.topic ? (
                      <p className="text-xs text-stone-500 mt-0.5 truncate max-w-[150px]">Hook: {session.topic}</p>
                    ) : (
                      <p className="text-xs text-stone-400 italic mt-0.5">No topic set</p>
                    )}
                  </div>
                  <button 
                    onClick={() => removeClass(session.id)}
                    className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {timetable.length === 0 && (
                <div className="text-center py-8 text-stone-400 text-sm italic">
                  No classes scheduled. Add one above.
                </div>
              )}
            </div>
          </section>

          {/* Context Settings */}
          <div className="space-y-8">
            
            {/* Subjects */}
            <section>
               <h3 className="font-serif text-lg text-stone-900 mb-3 flex items-center gap-2">
                 <Book className="w-4 h-4 text-stone-400" />
                 Subjects Taught
               </h3>
               <div className="flex flex-wrap gap-2">
                 {["Math", "Biology", "Physics", "Chemistry", "English", "History", "Hindi", "Sanskrit", "Computer Science", "Social Studies", "EVS", "Art"].map((subj) => {
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

            {/* Classes Taught - NOW EDITABLE KG-12 */}
            <section>
               <h3 className="font-serif text-lg text-stone-900 mb-3 flex items-center gap-2">
                 <Users className="w-4 h-4 text-stone-400" />
                 Classes Taught
               </h3>
               <div className="flex flex-wrap gap-2">
                 {classOptions.map((cls) => {
                   const isActive = formData.classes.includes(cls);
                   return (
                     <button 
                       key={cls}
                       onClick={() => isEditing && toggleSelection("classes", cls)}
                       disabled={!isEditing}
                       className={`w-12 h-12 rounded-full border text-sm font-medium transition-all flex items-center justify-center ${
                         isActive 
                           ? "bg-stone-800 text-white border-stone-800 shadow-md scale-105" 
                           : "bg-white border-stone-200 text-stone-500"
                       } ${!isEditing && !isActive ? 'opacity-50' : ''}`}
                     >
                       {cls}
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
