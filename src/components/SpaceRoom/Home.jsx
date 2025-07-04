import PostSection from './PostSection';
import Posts from './Posts';

export default function Home({ eventSpaceId, fetchMorePosts, hasMore, onPostCreated, onDeletePost, posts }) {


  return (
    <div className="flex flex-col mt-2 bg-[#ece7e3] gap-4">
      <PostSection onPostCreated={onPostCreated} eventSpaceId={eventSpaceId} />
      <Posts posts={posts} onDeletePost={onDeletePost} fetchMorePosts={fetchMorePosts} hasMore={hasMore}/>
    </div>
  );
}