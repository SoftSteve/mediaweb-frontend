import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Tabs from './components/SpaceRoom/Tabs';

const LIMIT = 5;

export default function SpaceRoom() {
  const { id } = useParams();

  /* ─────────────── state ─────────────── */
  const [eventSpace, setEventSpace] = useState(null);       // ⬅️ NEW
  const [posts, setPosts]           = useState([]);
  const [offset, setOffset]         = useState(0);
  const [hasMore, setHasMore]       = useState(true);
  const loadingRef = useRef(false);

  /* ─────────────── helpers ─────────────── */
  const getCsrf = () =>
    document.cookie.match(/csrftoken=([^;]+)/)?.[1] ?? '';

  /* --- fetch event-space detail once --- */
  useEffect(() => {
    async function fetchEventSpace() {
      try {
        const res  = await fetch(
          `http://softsteve.pythonanywhere.com/api/eventspace/${id}/`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('Failed to fetch space');
        const data = await res.json();
        setEventSpace(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (id) fetchEventSpace();
  }, [id]);

  /* --- paginated post loader --- */
  const loadPosts = async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    try {
      const res = await fetch(
        `http://softsteve.pythonanywhere.com/api/posts/?event_space=${id}&limit=${LIMIT}&offset=${offset}`,
        { credentials: 'include' }
      );
      const data     = await res.json();
      const newPosts = Array.isArray(data.results) ? data.results : data;

      setPosts(prev => [...prev, ...newPosts]);
      setOffset(prev => prev + LIMIT);
      setHasMore(Boolean(data.next));
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      loadingRef.current = false;
    }
  };

  /* --- reset & initial load when id changes --- */
  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    if (id) loadPosts();
  }, [id]);

  /* --- post create / delete helpers --- */
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setOffset(prev => prev + 1);
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(
        `http://softsteve.pythonanywhere.com/api/posts/${postId}/`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'X-CSRFToken': getCsrf() },
        }
      );
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== postId));
      setOffset(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  /* ─────────────── render ─────────────── */
  return (
    <div className="w-screen min-h-screen flex flex-col pb-20 mt-20 bg-[#ece7e3]">
      <Tabs
        eventSpaceId={id}
        eventSpace={eventSpace}          /* ⬅️ NEW prop */
        posts={posts}
        onPostCreated={handlePostCreated}
        onDeletePost={handleDeletePost}
        fetchMorePosts={loadPosts}
        hasMore={hasMore}
      />
    </div>
  );
}
