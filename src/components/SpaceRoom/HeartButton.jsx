import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

export default function HeartButton({onClick, children}) {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)} className="text-xl">
      <FaHeart className={liked ? 'text-red-500' : 'text-gray-400'} onClick={onClick}>{children}</FaHeart>
    </button>
  );
}