import { useState, useRef, useEffect } from 'react';
import Home from './Home';
import Gallery from './Gallery';
import More from './More';

export default function Tabs({ eventSpaceId, eventSpace={eventSpace}, spaceCode, fetchMorePosts, hasMore, onPostCreated, onDeletePost, posts }) {
  const [activeTab, setActiveTab] = useState('timeline');
  const tabRef = useRef(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      if (tabRef.current) {
        const tabTop = tabRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: tabTop,
          behavior: 'smooth',
        });
      }
    } else {
      hasMounted.current = true;
    }
  }, [activeTab]);

  return (
    <div>
      <div
      ref={tabRef} 
      className="h-16 w-full flex flex-row items-center bg-white">
        <div className="w-full flex justify-center">
          {['timeline', 'gallery', 'more'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-8 py-2 capitalize transition-colors md:text-xl text-gray-500 font-medium"
            >
              <span
                className={`inline-block pb-1 transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-500 font-bold'
                    : ''
                }`}
              >
                {tab}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        {activeTab === 'timeline' && <Home onPostCreated={onPostCreated} fetchMorePosts={fetchMorePosts} hasMore={hasMore}  onDeletePost={onDeletePost} eventSpaceId={eventSpaceId} spaceCode={spaceCode} posts={posts} />}
        {activeTab === 'gallery' && <Gallery posts={posts} />}
        {activeTab === 'more' && <More posts={posts} eventSpace={eventSpace} />}
      </div>
    </div>
  );
}