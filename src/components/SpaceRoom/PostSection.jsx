import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { useUser } from '../../UserContext';

const MAX_IMAGES = 8;

export default function PostSection({ eventSpaceId, onPostCreated }) {
  const fileRef = useRef();
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }

  /* --------------------------------------------------
   *  File handling (no client‑side compression)
   * --------------------------------------------------*/
  const handleFileChange = (e) => {
    let selected = Array.from(e.target.files);

    if (selected.length > MAX_IMAGES) {
      alert(`Limit is ${MAX_IMAGES} images per post.`);
      selected = selected.slice(0, MAX_IMAGES);
    }

    setFiles(selected);
    if (fileRef.current) fileRef.current.value = null;
  };

  /* --------------------------------------------------
   *  Submit
   * --------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && files.length === 0) return;
    setLoading(true);

    const fd = new FormData();
    fd.append('caption', caption);
    fd.append('event_space', eventSpaceId);
    files.forEach((f) => fd.append('images', f));

    const csrf = getCsrfTokenFromCookie();
    const headers = csrf ? { 'X_CSRFToken': csrf} : {};

    try {
      const res = await fetch(`https://api.memory-branch.com/api/posts/`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
        headers,
      });

      const newPost = await res.json().catch(() => null);

      if (res.ok && newPost) {
        setCaption('');
        setFiles([]);
        onPostCreated(newPost);
      } else {
        alert('Upload failed.');
      }
    } catch {
      alert('Network error – please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-24 flex flex-row gap-4 p-4 md:w-1/3 md:self-center md:mr-12">
      <div
        className="w-20 h-16 bg-gray-600 rounded-full bg-cover bg-center md:px-6 md:w-16"
        style={{
          backgroundImage: user?.profile_picture
            ? `url(https://api.memory-branch.com/${user.profile_picture})`
            : `url('/hs-4.jpg')`,
        }}
      ></div>

      <div className="flex flex-col w-full">
        <form onSubmit={handleSubmit} className="w-full h-full relative">
          <textarea
            placeholder="Write something..."
            className="w-full p-4 pr-12 border-b border-primary bg-[#ece7e3] resize-none focus:outline-none rounded-md"
            rows={1}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 10 }}
            disabled={loading}
            type="submit"
            className="w-full text-lg py-1 text-white bg-secondary rounded-lg"
          >
            {loading ? 'Posting...' : 'Post'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.2, color: '#3b82f6' }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              if (fileRef.current) fileRef.current.click();
            }}
            type="button"
            className="absolute right-4 bottom-6 flex flex-row items-center"
          >
            <MdAddPhotoAlternate className="text-2xl text-secondary" />
            {files.length > 0 && `(${files.length})`}
          </motion.button>

          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </form>
      </div>
    </div>
  );
}
