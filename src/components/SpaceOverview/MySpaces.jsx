import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { IoSearch, IoShareSocialOutline } from "react-icons/io5";
import axios from "axios";
import CreateModal from "./CreateSpaceModal";
import SearchSpaceModal from "./SearchSpaceModal";
import { IoShareOutline } from "react-icons/io5";

export default function MySpaces() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(""); 
  const [open, setOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearchModalOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    axios
      .get(`https://api.memory-branch.com/api/eventspace/`, { withCredentials: true })
      .then(res => setSpaces(res.data))
      .catch(err => setError(err));
  }, []);

  const handleSpaceCreated = (space) => {
    setSpaces(prev => [space, ...prev.filter(s => s.id !== space.id)]);
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return spaces.filter(s => s.name.toLowerCase().includes(q)).slice(0, 6); 
  }, [query, spaces]);


  return (
    <div className="w-full px-6 py-4 flex flex-col gap-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={query}
          placeholder="Search for event"
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)} 
          className="w-full px-4 py-3 border border-border text-black placeholder-gray-400 rounded-full focus:outline-none focus:ring-1 focus:ring-secondary"
        />
        <IoSearch
          className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 pointer-events-none"
        />

        {open && filtered.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {filtered.map(space => (
              <li
                key={space.id}
                onMouseDown={() => navigate(`/space/${space.id}`)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer truncate"
              >
                {space.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex w-full px-6 items-center justify-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSearchOpen(true)}
          className="p-2 w-full whitespace-nowrap rounded-full border border-gray-200 shadow-md bg-surface"
        >
          Join Event
        </motion.button>
        <SearchSpaceModal isOpen={isSearchModalOpen} onClose={() => setSearchOpen(false)}/>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="p-2 whitespace-nowrap w-full rounded-full border-gray-500 text-white shadow-md bg-secondary"
        >
          Create Event
        </motion.button>
        <CreateModal handleSpaceCreated={handleSpaceCreated} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
      </div>

      <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(query ? filtered : spaces).map((space, i) => (
          <motion.div
          key={space.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.15,
            duration: 0.35,
            ease: "easeOut",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/space/${space.id}`)}
          className="relative cursor-pointer rounded-xl shadow-lg overflow-hidden bg-white transition-all"
        >
          <div
            className="h-48 bg-cover bg-center"
            style={{ backgroundImage: `url(${space.cover_image})` }}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.share?.({
                title: "Lehman Wedding",
                url: `${window.location.origin}/space/${space.id}`
              }) || alert("Sharing not supported in this browser.");
            }}
            className="absolute top-2 right-2 p-2 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/50 transition"
          >
            <IoShareOutline className="text-xl text-white" />
          </button>

          <div className="p-4 bg-white rounded-b-xl flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-800">{space.name}</h2>
            <span className="text-sm text-gray-500">{space.members.length} Members</span>
          </div>
        </motion.div>
        ))}
      </div>

      {error && (
        <div className="flex flex-col gap-2 self-center mt-20 items-center">
          <p className="text-gray-500 text-xl">
          Sign in to view event spaces.
          </p>
          <a href="/sign-in" className="font-medium text-lg text-blue-500 hover:underline">Sign in</a>
        </div>
      )}
    </div>
  );
}
