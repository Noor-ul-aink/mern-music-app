import { Outlet } from "react-router-dom";
import { Music, Headphones, Radio } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Animated mesh background */}
      <div className="absolute inset-0 bg-mesh" />

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating decorative icons */}
      <div className="absolute top-16 left-16 text-primary/20 animate-float" style={{ animationDelay: '0s' }}>
        <Music size={32} />
      </div>
      <div className="absolute top-24 right-24 text-purple-400/15 animate-float" style={{ animationDelay: '2s' }}>
        <Headphones size={28} />
      </div>
      <div className="absolute bottom-20 left-32 text-emerald-400/15 animate-float" style={{ animationDelay: '4s' }}>
        <Radio size={24} />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        {/* Brand logo above card */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-glow-green">
            <Music size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            Music<span className="text-gradient">SaaS</span>
          </span>
        </div>

        <Outlet />

        {/* Footer */}
        <p className="mt-8 text-xs text-textSubtle text-center">
          © 2026 MusicSaaS · Stream. Discover. Repeat.
        </p>
      </div>
    </div>
  );
}
