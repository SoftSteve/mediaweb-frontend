import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { useUser } from '../../UserContext';
import { API_URL } from '../../config';

const USE_CLIENT_COMPRESSION = false;
const MAX_IMAGES = 8;

let compress;
if (USE_CLIENT_COMPRESSION) {
  import('browser-image-compression').then((mod) => (compress = mod.default));
}

export default function PostSection({ eventSpaceId, onPostCreated }) {
  const fileRef = useRef();
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const getCookie = (name) =>
    document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.[2];
  const csrftoken = getCookie('csrftoken');

  const handleFileChange = async (e) => {
    let selected = Array.from(e.target.files);

    if (selected.length > MAX_IMAGES) {
      alert(`Limit is ${MAX_IMAGES} images per post.`);
      selected = selected.slice(0, MAX_IMAGES);
    }

    if (USE_CLIENT_COMPRESSION && compress) {
      selected = await Promise.all(
        selected.map((f) =>
          compress(f, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true })
        )
      );
    }

    setFiles(selected);
    if (fileRef.current) fileRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption && files.length === 0) return;
    setLoading(true);

    const fd = new FormData();
    fd.append('caption', caption);
    fd.append('event_space', eventSpaceId);
    files.forEach((f) => fd.append('images', f));

    try {
      const res = await fetch(`https://api.memory-branch.com/api/posts/`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
        headers: { 'X-CSRFToken': csrftoken },
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
