import { useEffect, useState } from "react";
import api from "../services/api";
import { useOutletContext } from "react-router-dom";
import { Play, Pause, Heart, Search, Music2, TrendingUp, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getUser } from "../utils/storage";

// Deterministic gradient per song.id
const GRADIENTS = [
  "from-purple-600 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
  "from-indigo-600 to-violet-700",
  "from-green-600 to-emerald-500",
  "from-red-600 to-pink-600",
  "from-sky-500 to-blue-600",
];

export default function Songs({ likedOnly = false }) {
  const [songs, setSongs] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null); // songId
  const [search, setSearch] = useState("");
  const { currentSong, setCurrentSong, isPlaying, togglePlay } = useOutletContext();

  const user = getUser();
  const userId = user?.id || 1;

  useEffect(() => {
    fetchData();
  }, [likedOnly]);

  const fetchData = async () => {
    try {
      const [songsRes, likesRes, playlistsRes] = await Promise.all([
        api.get("/songs"),
        api.get(`/likes/${userId}`),
        api.get(`/playlists/${userId}`)
      ]);
      
      const liked = likesRes.data.map(l => l.songId);
      setLikedIds(liked);
      setPlaylists(playlistsRes.data);

      if (likedOnly) {
        setSongs(songsRes.data.filter(s => liked.includes(s.id)));
      } else {
        setSongs(songsRes.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const addToPlaylist = async (playlistId, songId) => {
    try {
      await api.post("/playlists/add-song", { playlistId, songId });
      toast.success("Added to playlist");
      setShowPlaylistMenu(null);
    } catch (error) {
      toast.error("Failed to add to playlist");
    }
  };

  const likeSong = async (e, songId) => {
    e.stopPropagation();
    try {
      if (likedIds.includes(songId)) {
        toast.error("Already liked");
        return;
      }
      await api.post("/likes", { userId, songId });
      setLikedIds([...likedIds, songId]);
      toast.success("Added to Liked Songs");
      if (likedOnly) {
        setSongs(songs.filter(s => s.id !== songId)); // If we were in liked section and unliked (though no unlike logic yet)
      }
    } catch (error) {
      toast.error("Failed to like song");
    }
  };

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="animate-fade-in">
      {/* ── HERO ──────────────────────────────────────── */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-purple-700 via-indigo-700 to-background">
        {/* Animated background blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/60 via-indigo-600/40 to-transparent" />
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl" />

        <div className="relative h-full flex flex-col justify-end p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} />
              Trending
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {likedOnly ? "Liked Songs" : "Discover Music"}
          </h1>
          <p className="text-white/60 mt-1.5 text-sm">
            {songs.length > 0 ? `${songs.length} tracks ready to play` : "Stream trending tracks instantly"}
          </p>
        </div>
      </div>

      {/* ── SEARCH ─────────────────────────────────────── */}
      <div className="relative max-w-sm mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSubtle" size={16} />
        <input
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/8 text-white text-sm
                     placeholder-textSubtle outline-none
                     focus:ring-2 focus:ring-primary/40 focus:border-primary/30 focus:bg-white/8
                     transition-all duration-200"
          placeholder="Search songs or artists…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── SECTION HEADING ─────────────────────────────── */}
      {search ? (
        <h2 className="text-lg font-bold text-white mb-4">
          Results for &ldquo;{search}&rdquo;
          <span className="ml-2 text-sm font-normal text-textMuted">({filtered.length})</span>
        </h2>
      ) : (
        <h2 className="text-lg font-bold text-white mb-4">{likedOnly ? "Your Favorites" : "All Songs"}</h2>
      )}

      {/* ── GRID ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Music2 size={48} className="text-textSubtle mb-4 opacity-50" />
          <p className="text-white font-semibold text-lg">No songs found</p>
          <p className="text-textMuted text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((song) => {
            const active = currentSong?.id === song.id;
            const gradient = GRADIENTS[(song.id ?? 0) % GRADIENTS.length];

            return (
              <div
                key={song.id}
                onClick={() => {
                  if (active) {
                    togglePlay();
                  } else {
                    setCurrentSong(song);
                  }
                }}
                className={`song-card flex flex-col ${active ? "ring-2 ring-primary/60 bg-cardHover" : ""}`}
              >
                {/* Album Art */}
                <div className="relative mb-3">
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${gradient} shadow-card overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music2 size={28} className="text-white/30" />
                    </div>
                  </div>

                  {/* Now-playing indicator */}
                  {active && (
                    <div className="absolute bottom-2 left-2 flex items-end gap-0.5 h-4">
                      <span className="eq-bar" />
                      <span className="eq-bar" />
                      <span className="eq-bar" />
                    </div>
                  )}

                  {/* Play button overlay */}
                  <button
                    className="absolute bottom-2 right-2 h-9 w-9 rounded-full bg-primary text-black
                               shadow-glow-green flex items-center justify-center
                               play-overlay hover:scale-110 active:scale-95 transition-transform"
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (active) {
                        togglePlay();
                      } else {
                        setCurrentSong(song);
                      }
                    }}
                  >
                    {active && isPlaying ? (
                      <Pause size={16} fill="black" />
                    ) : (
                      <Play size={16} fill="black" />
                    )}
                  </button>
                </div>

                {/* Song Info */}
                <h3
                  className={`text-sm font-semibold truncate leading-tight ${
                    active ? "text-primary" : "text-white"
                  }`}
                >
                  {song.title}
                </h3>
                <p className="text-xs text-textMuted mt-0.5 truncate">{song.artist}</p>

                {/* Like button */}
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                    onClick={(e) => likeSong(e, song.id)}
                    className={`transition-colors ${likedIds.includes(song.id) ? "text-pink-500" : "text-textSubtle hover:text-pink-400"}`}
                    title={likedIds.includes(song.id) ? "Liked" : "Like song"}
                  >
                    <Heart size={15} fill={likedIds.includes(song.id) ? "currentColor" : "none"} />
                  </button>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPlaylistMenu(showPlaylistMenu === song.id ? null : song.id);
                      }}
                      className="text-textSubtle hover:text-white transition-colors"
                      title="Add to playlist"
                    >
                      <Plus size={16} />
                    </button>

                    {showPlaylistMenu === song.id && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#181818] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1">
                        <p className="px-3 py-1.5 text-[10px] font-bold text-textSubtle uppercase tracking-wider border-b border-white/5">
                          Add to playlist
                        </p>
                        {playlists.length === 0 ? (
                          <p className="px-3 py-2 text-[10px] text-textMuted italic">No playlists found</p>
                        ) : (
                          playlists.map((p) => (
                            <button
                              key={p._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToPlaylist(p._id, song.id);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-textMuted hover:text-white hover:bg-white/5 transition-colors truncate"
                            >
                              {p.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
