import { useState } from 'react';
import Home from './Home';
import Gallery from './Gallery';
import More from './More';

export default function Tabs({ eventSpaceId, eventSpace={eventSpace}, fetchMorePosts, hasMore, onPostCreated, onDeletePost, posts }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div>
      <div className="h-16 w-full flex flex-row items-center top-0 bg-[#ece7e3] z-10">
        <div className="w-full flex border-t border-border justify-center">
          {['home', 'gallery', 'more'].map((tab) => (
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
        {activeTab === 'home' && <Home onPostCreated={onPostCreated} fetchMorePosts={fetchMorePosts} hasMore={hasMore}  onDeletePost={onDeletePost} eventSpaceId={eventSpaceId} posts={posts} />}
        {activeTab === 'gallery' && <Gallery posts={posts} />}
        {activeTab === 'more' && <More posts={posts} eventSpace={eventSpace} />}
      </div>
    </div>
  );
}