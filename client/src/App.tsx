import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Crisis from "@/pages/Crisis";
import Prep from "@/pages/Prep";
import Reflect from "@/pages/Reflect";
import Profile from "@/pages/Profile";
import Onboarding from "@/pages/Onboarding";
import Speak from "@/pages/Speak";
import { Sparkles } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-stone-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-50" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-sm">
        <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center shadow-xl">
          <Sparkles className="w-10 h-10 text-stone-50" />
        </div>
        <h1 className="font-serif text-4xl text-stone-900 leading-tight">TeacherOS</h1>
        <p className="text-xl text-stone-600 leading-relaxed">
          Your calm companion for the chaos of the classroom.
        </p>
        <a
          href="/api/login"
          data-testid="button-login"
          className="flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-stone-800 transition-all"
        >
          Log In to Get Started
        </a>
      </div>
    </div>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  return <Component />;
}

function HomeRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return <Home />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRoute}/>
      <Route path="/onboarding">
        <ProtectedRoute component={Onboarding} />
      </Route>
      <Route path="/crisis">
        <ProtectedRoute component={Crisis} />
      </Route>
      <Route path="/prep">
        <ProtectedRoute component={Prep} />
      </Route>
      <Route path="/reflect">
        <ProtectedRoute component={Reflect} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/speak">
        <ProtectedRoute component={Speak} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
