import { Outlet, Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart, X } from "lucide-react";

export default function DashboardLayout() {
  const token = localStorage.getItem("token");
  const [currentSong, setCurrentSong] = useState(null);

  // ─── Audio Engine (same currentSong state, same setCurrentSong prop) ───
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Auto-play on song change
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentSong]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Save history when song starts playing
  useEffect(() => {
    const saveToHistory = async () => {
      if (currentSong) {
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.id) {
              await api.post("/history", {
                userId: user.id,
                songId: currentSong.id
              });
            }
          }
        } catch (err) {
          console.error("Failed to save history:", err);
        }
      }
    };
    saveToHistory();
  }, [currentSong]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio * duration);
  };

  const handleEnded = () => setIsPlaying(false);

  const fmtTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  // Deterministic color palette for song art
  const songGradients = [
    "from-purple-600 to-blue-600",
    "from-pink-600 to-rose-500",
    "from-amber-500 to-orange-600",
    "from-teal-500 to-cyan-600",
    "from-indigo-600 to-violet-700",
    "from-green-600 to-emerald-500",
  ];
  const artGradient = currentSong
    ? songGradients[(currentSong.id ?? 0) % songGradients.length]
    : songGradients[0];

  return (
    <div className="flex h-screen bg-background text-textMain overflow-hidden">
      <Sidebar currentSong={currentSong} />

      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ paddingBottom: currentSong ? '88px' : '0' }}>
        <Navbar />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-8 bg-gradient-to-b from-[#1c1c1c] via-[#161616] to-background">
          <div className="max-w-[1400px] mx-auto mt-4">
            {/* Pass currentSong and setCurrentSong to all child routes */}
            <Outlet context={{ currentSong, setCurrentSong, isPlaying, togglePlay }} />
          </div>
        </main>
      </div>

      {/* Hidden audio element */}
      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
      )}

      {/* ─── Premium Global Audio Player ─────────────────────────────── */}
      {currentSong && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up" style={{ height: '88px' }}>
          {/* Progress bar — clickable, sits at very top of player */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-white/10 cursor-pointer group/progress"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary transition-all duration-100 relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-glow-sm opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Player body */}
          <div className="absolute inset-0 top-1 bg-playerBg/95 backdrop-blur-2xl border-t border-white/5 shadow-player px-4 sm:px-6 flex items-center gap-4">

            {/* ── Left: Song Info ─────────────────────────────── */}
            <div className="flex items-center gap-3 w-[30%] min-w-[160px] max-w-[300px]">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${artGradient} flex-shrink-0 flex items-center justify-center shadow-card`}>
                <Music size={18} className="text-white/60" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {currentSong.title}
                </p>
                <p className="text-xs text-textMuted truncate mt-0.5">
                  {currentSong.artist}
                </p>
              </div>
              <button className="ml-1 text-textSubtle hover:text-primary transition-colors flex-shrink-0">
                <Heart size={16} />
              </button>
            </div>

            {/* ── Centre: Controls ────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 sm:gap-6">
                <button className="text-textMuted hover:text-white transition-colors hidden sm:block">
                  <SkipBack size={18} fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0
                             hover:scale-105 active:scale-95 transition-transform shadow-glow-sm"
                >
                  {isPlaying
                    ? <Pause size={18} className="text-black" fill="black" />
                    : <Play  size={18} className="text-black ml-0.5" fill="black" />
                  }
                </button>

                <button className="text-textMuted hover:text-white transition-colors hidden sm:block">
                  <SkipForward size={18} fill="currentColor" />
                </button>
              </div>

              {/* Time display */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-textSubtle mt-0.5">
                <span className="w-8 text-right">{fmtTime(progress)}</span>
                <span className="w-4 text-center opacity-40">·</span>
                <span className="w-8">{fmtTime(duration)}</span>
              </div>
            </div>

            {/* ── Right: Volume & Close ────────────────────────── */}
            <div className="w-[30%] max-w-[200px] flex items-center justify-end gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Volume2 size={16} className="text-textMuted flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-24 h-1 rounded-full appearance-none bg-white/20 cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none
                             [&::-webkit-slider-thumb]:w-3
                             [&::-webkit-slider-thumb]:h-3
                             [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:bg-white
                             hover:[&::-webkit-slider-thumb]:bg-primary
                             [&::-webkit-slider-thumb]:transition-colors"
                  style={{
                    background: `linear-gradient(to right, #1ed760 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`
                  }}
                />
              </div>
              
              <button 
                onClick={() => setCurrentSong(null)}
                className="text-textMuted hover:text-white transition-colors p-1"
                title="Close Player"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
