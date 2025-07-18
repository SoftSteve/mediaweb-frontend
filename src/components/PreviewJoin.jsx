import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../UserContext";

export default function PreviewJoin({ space, spaceCode }) {
  const navigate = useNavigate();
  const { user } = useUser(); 

const handleJoin = async () => {
  if (user) {
    try {
      const res = await fetch(
        `https://api.memory-branch.com/api/space-lookup/?code=${spaceCode}`,
        {
          credentials: 'include',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }
      );
      if (res.ok) {
        const data = await res.json();
        navigate(`/space/${data.event_id}`);
      } else {
        alert('Failed to join space.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  } else {
    navigate('/sign-in', {
      state: { spaceCode: spaceCode, eventId: space.id },
    });
  }
};

  return (
    <div className="w-full h-screen flex flex-col px-6 justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg bg-white"
      >
        <div
          className="h-60 relative bg-cover bg-center"
          style={{ backgroundImage: `url('https://api.memory-branch.com${space.cover_image || '/wedding.jpg'}')` }}
        >
          <div className="absolute inset-0 bg-black/25"></div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{space.name}</h1>
            <p className="text-sm text-gray-500">You're invited to join this space.</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleJoin}
            className="bg-primary text-white font-semibold py-2 rounded-lg shadow hover:bg-primary/90 transition-all"
          >
            {user ? 'Enter Space': 'Join Space'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
