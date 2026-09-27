import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Music, ListMusic, Heart, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function Sidebar({ currentSong }) {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  const nav = [
    { name: "Home", path: "/songs", icon: Home },
    { name: "Playlists", path: "/playlists", icon: ListMusic },
  ];

  return (
    <aside 
      className="w-64 h-full bg-[#0a0a0a] border-r border-white/5 hidden md:flex flex-col flex-shrink-0 animate-slide-in-left"
      style={{ paddingBottom: currentSong ? '88px' : '0' }}
    >
      
      {/* ── Brand Logo ────────────────────────────────── */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/5">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-glow-sm flex-shrink-0">
          <Music size={18} className="text-black" />
        </div>
        <div>
          <h1 className="text-base font-black text-white leading-none tracking-tight">
            Music<span className="text-gradient">SaaS</span>
          </h1>
          <p className="text-[10px] text-textSubtle mt-0.5 uppercase tracking-widest">Stream · Discover</p>
        </div>
      </div>

      {/* ── Main Navigation ───────────────────────────── */}
      <div className="px-3 pt-5 space-y-1">
        <p className="px-4 mb-2 text-[10px] font-semibold text-textSubtle uppercase tracking-widest">
          Browse
        </p>
        {nav.map((n) => {
          const Icon = n.icon;
          const active = location.pathname === n.path;

          return (
            <Link
              key={n.path}
              to={n.path}
              className={
                active
                  ? "nav-link-active"
                  : "nav-link"
              }
            >
              <Icon size={18} className={active ? "text-primary" : ""} />
              {n.name}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Library Section ───────────────────────────── */}
      <div className="px-3 mt-6">
        <p className="px-4 mb-2 text-[10px] font-semibold text-textSubtle uppercase tracking-widest">
          Your Library
        </p>
        <div className="space-y-1">
          <Link
            to="/liked"
            className={location.pathname === "/liked" ? "nav-link-active" : "nav-link group/liked"}
          >
            <Heart size={18} className="group-hover/liked:text-pink-400 transition-colors" />
            Liked Songs
            <span className="ml-auto text-[10px] bg-white/5 text-textSubtle px-2 py-0.5 rounded-full">
              ♥
            </span>
          </Link>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="mx-5 mt-auto mb-4 border-t border-white/5" />

      {/* ── Sign Out ──────────────────────────────────── */}
      <div className="px-3 pb-5">
        <button
          onClick={logout}
          className="btn-danger w-full flex items-center justify-center gap-2 rounded-xl py-2.5"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
