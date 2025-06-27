import Post from './Post';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Posts({ posts, fetchMorePosts, hasMore, onDeletePost }) {
  return (
    <InfiniteScroll
      scrollThreshold='5px'
      dataLength={posts.length} 
      next={fetchMorePosts}   
      hasMore={hasMore}        
      loader={<p className="text-center mt-4 text-secondary/50">Loading more posts...</p>}
      endMessage={
        <p className="text-center mt-4 text-secondary/50">
          You've reached the end.
        </p>
      }
    >
      <div className="w-full flex flex-col mt-6 items-center">
        {posts.map((post) => (
          <Post
            key={post.id}
            name={post.author.username}
            image={post.images}
            caption={post.caption}
            time={post.created_at}
            onDeletePost={onDeletePost}
            postId={post.id}
            postLikes={post.likes}
            profilePicture={post.author.profile_picture}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}