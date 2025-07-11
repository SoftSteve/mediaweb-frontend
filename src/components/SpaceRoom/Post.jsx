import { memo, useCallback, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FaRegComment, FaEllipsisH, FaHeart } from 'react-icons/fa';
import PostOptions from './PostOptions';
import CommentSection from './Comment';


function getAspectClass(width, height) {
  if (!width || !height) return 'aspect-[4/5]';

  const ratio = width / height;

  if (ratio > 1.91) return 'aspect-[1.91/1]';
  if (ratio < 0.8) return 'aspect-[4/5]';
  return 'aspect-[1/1]';
}

function PostHeader({ avatar, name, time, onOptions }) {
  return (
    <header className="flex items-start gap-3 px-4 pt-4 md:px-0">
      <img
        loading="lazy"
        src={avatar || "/hs-4.jpg"}
        alt={`${name} avatar`}
        className="h-10 w-10 rounded-full object-cover"
      />
      <div className="flex flex-1 flex-col">
        <span className="text-base font-semibold text-secondary">{name}</span>
        <time className="text-xs text-secondary/50">{time}</time>
      </div>
      <button onClick={onOptions} className="p-2 text-secondary/80 hover:text-secondary">
        <FaEllipsisH />
      </button>
    </header>
  );
}

function PostGallery({ images }) {
  if (!images.length) return null;

  return (
    <Swiper
      modules={[Pagination, Zoom]}
      zoom
      slidesPerView={1}
      className="w-full max-w-lg overflow-hidden rounded-md border border-gray-300"
      pagination={{ clickable: true, type: 'bullets', dynamicBullets: true }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={img.id ?? i} className="relative w-full h-[80vw] md:h-[60vh] flex items-center justify-center bg-gray-100">
          {/* Blurred background */}
          <img
            src={img.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
          />
          {/* Main image */}
          <img
            src={img.image}
            alt={`post-media-${i}`}
            className="relative max-h-full max-w-full object-contain rounded-md"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function PostActions({ liked, likes, onLike, onComment, commentCount }) {
  return (
    <div className="flex items-center gap-4 px-6 py-1">
      <button
        onClick={onLike}
        className="flex items-center gap-1 text-secondary hover:text-gray-400 focus:outline-none"
      >
        <FaHeart className={`${liked ? "fill-red-500" : "fill-gray-400"} h-5 w-5 stroke-current`} />
        <span>{likes}</span>
      </button>
      <button
        onClick={onComment}
        className="flex flex-row items-center gap-1 text-gray-400 hover:text-blue-500 focus:outline-none"
      >
        <FaRegComment className="h-5 w-5" />
        {commentCount > 0 && <p>{commentCount}</p>}
      </button>
    </div>
  );
}

function Post({
  postId,
  name,
  profilePicture,
  caption = "",
  time = "just now",
  image = [],
  postLikes = 0,
  onDeletePost,
}) {
  const [likes, setLikes] = useState(postLikes);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  }, [liked]);

  // 🔥 Fetch comment count on first render
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await fetch(`https://api.memory-branch.com/api/posts/${postId}/`, {
          credentials: 'include',
        });
        const data = await res.json();
        setCommentCount(data.comments?.length || 0);
      } catch (err) {
        console.error('Failed to fetch comment count', err);
      }
    };

    fetchCommentCount();
  }, [postId]);

  return (
    <article className="flex w-full max-w-xl flex-col gap-2 lg:w-1/4">
      {/* Header */}
      <PostHeader
        avatar={profilePicture}
        name={name}
        time={time}
        onOptions={() => setShowOptions(true)}
      />

      {/* Media */}
      <PostGallery images={image} />

      {/* Actions */}
      <PostActions
        liked={liked}
        likes={likes}
        onLike={toggleLike}
        onComment={() => setShowComments(true)}
        commentCount={commentCount}
      />

      {/* Caption */}
      {caption && <p className="px-4 pb-4 text-secondary/80">{caption}</p>}

      {/* Lazy-mounted overlays */}
      {showOptions && (
        <PostOptions
          isOpen={showOptions}
          postId={postId}
          images={image}
          onDeletePost={onDeletePost}
          onClose={() => setShowOptions(false)}
        />
      )}
      {showComments && (
        <CommentSection
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          postId={postId}
          onCommentAdded={(length) => setCommentCount(length)}
        />
      )}
    </article>
  );
}

export default memo(Post);
