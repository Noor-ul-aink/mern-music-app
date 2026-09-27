import { useEffect, useState } from "react";
import api from "../services/api";
import { useOutletContext } from "react-router-dom";
import { ListMusic, Plus, FolderPlus, Search, Play, Music2 } from "lucide-react";
import toast from "react-hot-toast";
import { getUser } from "../utils/storage";

// Deterministic gradient per playlist name
const GRADIENTS = [
  "from-purple-600 to-indigo-700",
  "from-pink-600 to-rose-700",
  "from-teal-500 to-cyan-700",
  "from-amber-500 to-orange-700",
  "from-emerald-600 to-green-700",
  "from-blue-600 to-sky-700",
  "from-violet-600 to-purple-700",
  "from-red-500 to-pink-700",
];

function getGradient(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

// Shimmer skeleton card
function SkeletonCard() {
  return (
    <div className="playlist-card flex flex-col pointer-events-none">
      <div className="aspect-square rounded-lg shimmer-bg mb-3" />
      <div className="h-3.5 shimmer-bg rounded-md w-3/4 mb-2" />
      <div className="h-2.5 shimmer-bg rounded-md w-1/2" />
    </div>
  );
}

export default function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const { setCurrentSong } = useOutletContext();

  const user = getUser();
  const userId = user?.id || 1;

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/playlists/${userId}`);
      setPlaylists(res.data);
    } catch (error) {
      toast.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post("/playlists", { userId, name });
      setName("");
      toast.success("Playlist created!");
      fetchPlaylists();
    } catch (error) {
      toast.error("Failed to create playlist");
    }
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full pb-10 animate-fade-in relative">
      {selectedPlaylist ? (
        <div className="flex flex-col">
          <button 
            onClick={() => setSelectedPlaylist(null)}
            className="self-start text-xs font-bold text-primary hover:underline mb-6 flex items-center gap-1"
          >
            ← Back to Playlists
          </button>
          
          <div className="flex items-end gap-6 mb-8">
            <div className={`h-48 w-48 rounded-2xl bg-gradient-to-br ${getGradient(selectedPlaylist.name)} shadow-2xl flex items-center justify-center`}>
              <ListMusic size={64} className="text-white/20" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">Playlist</p>
              <h1 className="text-5xl font-black text-white tracking-tighter mb-4">{selectedPlaylist.name}</h1>
              <p className="text-sm text-textMuted font-medium">
                {user?.name} • {selectedPlaylist.songDetails?.length || 0} songs
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-sm text-textMuted">
              <thead className="border-b border-white/5 bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]"># Title</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Artist</th>
                  <th className="px-6 py-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {selectedPlaylist.songDetails?.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center italic text-textSubtle">No songs in this playlist yet.</td>
                  </tr>
                ) : (
                  selectedPlaylist.songDetails.map((song, idx) => (
                    <tr key={song.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium flex items-center gap-4">
                        <span className="w-4 text-textSubtle font-normal">{idx + 1}</span>
                        {song.title}
                      </td>
                      <td className="px-6 py-4">{song.artist}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setCurrentSong(song)}
                          className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Your Library</h1>
        <p className="text-textMuted text-sm mt-1">
          {playlists.length > 0
            ? `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""} saved`
            : "Create your first playlist to get started"}
        </p>
      </div>

      {/* ── Top Bar: Create + Search ─────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">

        {/* Create playlist input */}
        <form onSubmit={createPlaylist} className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Music2 size={16} className="text-textSubtle" />
          </div>
          <input
            value={name}
            className="w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/8 text-white text-sm
                       placeholder-textSubtle rounded-xl outline-none
                       focus:ring-2 focus:ring-primary/40 focus:border-primary/30
                       transition-all duration-200"
            placeholder="New playlist name…"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-black rounded-lg px-3
                       disabled:opacity-40 disabled:cursor-not-allowed
                       hover:bg-primaryHover hover:scale-105 active:scale-95
                       transition-all duration-150 flex items-center gap-1 font-semibold text-sm"
          >
            <Plus size={16} />
          </button>
        </form>

        {/* Search filter */}
        <div className="relative sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={14} className="text-textSubtle" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/8 text-white text-sm
                       placeholder-textSubtle rounded-xl outline-none
                       focus:ring-2 focus:ring-primary/40 focus:border-primary/30
                       transition-all duration-200"
            placeholder="Find a playlist…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Content States ─────────────────────────────── */}

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>

      ) : playlists.length === 0 ? (
        /* Empty state — no playlists yet */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <FolderPlus size={36} className="text-textSubtle" />
          </div>
          <p className="text-xl font-bold text-white mb-2">Create your first playlist</p>
          <p className="text-textMuted text-sm max-w-xs">
            It&apos;s easy — just type a name above and hit the&nbsp;
            <span className="text-primary font-semibold">+</span> button.
          </p>
        </div>

      ) : filteredPlaylists.length === 0 ? (
        /* No search results */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Search size={32} className="text-textSubtle" />
          </div>
          <p className="text-xl font-bold text-white mb-2">No playlists found</p>
          <p className="text-textMuted text-sm">Try adjusting your search.</p>
        </div>

      ) : (
        /* Playlist grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPlaylists.map((p) => {
            const grad = getGradient(p.name);
            return (
              <div
                key={p._id}
                onClick={() => setSelectedPlaylist(p)}
                className="playlist-card flex flex-col group"
              >
                {/* Art */}
                <div className={`aspect-square rounded-lg bg-gradient-to-br ${grad} relative overflow-hidden mb-3 shadow-card`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ListMusic className="text-white/25" size={36} />
                  </div>

                  {/* Play overlay */}
                  <div className="play-overlay absolute bottom-2.5 right-2.5">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (p.songDetails && p.songDetails.length > 0) {
                          setCurrentSong(p.songDetails[0]);
                        } else {
                          toast.error("No songs in this playlist");
                        }
                      }}
                      className="h-9 w-9 rounded-full bg-primary text-black shadow-glow-green flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Play size={15} fill="black" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-sm font-semibold text-white truncate leading-tight">
                  {p.name}
                </h3>
                <p className="text-xs text-textMuted mt-0.5">
                  {p.songs.length} {p.songs.length === 1 ? "song" : "songs"}
                </p>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
