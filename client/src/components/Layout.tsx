import { Link, useLocation } from "wouter";
import { Home, Zap, BookOpen, BarChart3, User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Zap, label: "Crisis", path: "/crisis", isCrisis: true },
    { icon: BookOpen, label: "Prep", path: "/prep" },
    { icon: BarChart3, label: "Reflect", path: "/reflect" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col w-full md:max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans md:border-x border-stone-200">
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#FDFCF8]/95 backdrop-blur-md border-t border-stone-200 px-6 py-4 pb-8 safe-area-bottom z-50 w-full md:max-w-md mx-auto">
        <div className="flex justify-between items-end">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            // Special styling for Crisis button to be easily accessible
            if (item.isCrisis) {
               return (
                <Link key={item.path} href={item.path}>
                  <div className="relative -top-6 cursor-pointer group">
                    <div className={`p-4 rounded-full shadow-lg transition-transform duration-300 ${isActive ? 'bg-red-600 scale-110' : 'bg-stone-900 hover:scale-105'}`}>
                      <Icon className="w-6 h-6 text-white stroke-[2.5px]" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase text-red-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pt-1">
                      Emergency
                    </span>
                  </div>
                </Link>
               )
            }

            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center gap-1.5 cursor-pointer group w-12">
                  <div className={`transition-colors duration-300`}>
                    <Icon 
                      className={`w-6 h-6 ${isActive ? 'text-stone-900 stroke-[2.5px]' : 'text-stone-400 group-hover:text-stone-600'}`} 
                    />
                  </div>
                  <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-stone-900' : 'text-stone-400'}`}>
                    {item.label}
                  </span>
                  {isActive && <div className="w-1 h-1 rounded-full bg-stone-900 mt-0.5" />}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
