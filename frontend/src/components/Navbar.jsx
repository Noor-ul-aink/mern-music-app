import { User, Menu, Music, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser } from "../utils/storage";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const user = getUser();

  // Get user initial for avatar
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <header
      className={`h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-black/75 backdrop-blur-2xl border-b border-white/5 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button className="text-textMuted hover:text-white transition-colors p-1">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center">
            <Music size={14} className="text-black" />
          </div>
          <span className="text-sm font-bold text-white">MusicSaaS</span>
        </div>
      </div>

      {/* Desktop: spacer keeps user pill right-aligned */}
      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell (static placeholder, no logic) */}
        <button className="hidden sm:flex items-center justify-center h-8 w-8 rounded-full text-textMuted hover:text-white hover:bg-white/5 transition-all">
          <Bell size={17} />
        </button>

        {/* User pill */}
        {user ? (
          <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
            {/* Avatar */}
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-glow-sm group-hover:shadow-glow-green transition-shadow">
              {userInitial ? (
                <span className="text-xs font-bold text-black">{userInitial}</span>
              ) : (
                <User size={14} className="text-black" />
              )}
            </div>
            <span className="text-sm text-white font-medium truncate max-w-[120px]">
              {user.name}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
