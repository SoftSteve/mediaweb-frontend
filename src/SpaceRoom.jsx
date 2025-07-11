import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Tabs from './components/SpaceRoom/Tabs';
import SpaceHeader from './components/SpaceRoom/SpaceHeader';

const LIMIT = 20;

export default function SpaceRoom() {
  const { id } = useParams();

  const [eventSpace, setEventSpace] = useState(null);
  const [posts, setPosts]           = useState([]);
  const [offset, setOffset]         = useState(0);
  const [hasMore, setHasMore]       = useState(true);
  const loadingRef = useRef(false);

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }

  useEffect(() => {
    async function fetchEventSpace() {
      try {
        const res  = await fetch(
          `https://api.memory-branch.com/api/eventspace/${id}/`,
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

  const loadPosts = async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;

    try {
      const res = await fetch(
        `https://api.memory-branch.com/api/posts/?event_space=${id}&limit=${LIMIT}&offset=${offset}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      const newPosts = Array.isArray(data.results) ? data.results : [];

      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setOffset(prev => prev + newPosts.length); // Only increment by what you actually received
      }

      // Determine if more data exists
      setHasMore(Boolean(data.next) && newPosts.length === LIMIT);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    if (id) {
      loadingRef.current = false;
      setTimeout(() => loadPosts(), 0);
    } 
  }, [id]);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setOffset(prev => prev + 1);
  };

  const handleDeletePost = async (postId) => {
    try {
      const res = await fetch(
        `https://api.memory-branch.com/api/posts/${postId}/`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'X-CSRFToken': getCsrfTokenFromCookie() },
        }
      );
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== postId));
      setOffset(prev => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col pb-20 mt-20 bg-white">
      <SpaceHeader eventSpace={eventSpace}/>
      <Tabs
        eventSpaceId={id}
        eventSpace={eventSpace}
        spaceCode={eventSpace?.space_code}
        posts={posts}
        onPostCreated={handlePostCreated}
        onDeletePost={handleDeletePost}
        fetchMorePosts={loadPosts}
        hasMore={hasMore}
      />
    </div>
  );
}
