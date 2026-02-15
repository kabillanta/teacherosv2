import { Link, useLocation } from "wouter";
import { Home, Zap, BookOpen, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Zap, label: "Crisis", path: "/crisis" },
    { icon: BookOpen, label: "Prep", path: "/prep" },
    { icon: BarChart3, label: "Reflect", path: "/reflect" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-6 py-3 pb-8 safe-area-bottom z-50 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path}>
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10 scale-110' : 'hover:bg-gray-100'}`}>
                    <Icon 
                      className={`w-6 h-6 transition-colors ${isActive ? 'text-primary stroke-[2.5px]' : 'text-gray-400 stroke-2'}`} 
                    />
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
