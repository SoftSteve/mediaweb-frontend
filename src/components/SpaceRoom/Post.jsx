import { memo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import HeartButton from './HeartButton';
import { FaRegComment, FaEllipsisH, FaHeart } from 'react-icons/fa';
import { HiDotsHorizontal } from 'react-icons/hi';
import { useState } from 'react';
import PostOptions from './PostOptions';
import { useUser } from '../../UserContext';
import CommentSection from './Comment';


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
      className="aspect-[4/5] w-full overflow-hidden md:rounded-md md:border border-gray-400 md:border-0"
      pagination={{ clickable: false, type: "bullets", dynamicBullets: true }}
    >
      {images.map((img, i) => (
        <SwiperSlide key={img.id ?? i}>
          <div className="swiper-zoom-container h-full w-full">
            <img
              loading="lazy"
              src={img.image}
              alt={`post-media-${i}`}
              className="h-full w-full object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function PostActions({ liked, likes, onLike, onComment }) {
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
        className="text-gray-400 hover:text-blue-500 focus:outline-none"
      >
        <FaRegComment className="h-5 w-5" />
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

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  }, [liked]);

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
      />

      {/* Caption */}
      {caption && <p className="px-4 pb-4 text-secondary/80">{caption}</p>}

      {/* Lazy‑mounted overlays */}
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
        />
      )}
    </article>
  );
}

export default memo(Post);
