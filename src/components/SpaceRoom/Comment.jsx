import {
  DialogPanel,
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { useUser } from "../../UserContext";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { API_URL } from "../../config";

const max_chars = 255;
const max_rows = 2;

export default function CommentSection({ isOpen, onClose, postId, onCommentAdded }) {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentPostedTrigger, setCommentPostedTrigger] = useState(0);
  const taRef = useRef();

  const handleClose = () => {
    onClose();
    setComment('');
    setComments([]);
    setError('');
  };

  useEffect(() => {
    if (isOpen && postId) {
      const frame = requestAnimationFrame(() => {
        const fetchComments = async () => {
          setLoading(true);
          try {
            const response = await fetch(`https://api.memory-branch.com/api/posts/${postId}/`, {
              credentials: 'include',
            });
            const data = await response.json();
            setComments(data.comments || []);
            onCommentAdded?.(data.comments?.length || 0);
          } catch (err) {
            console.error("Failed to load comments", err);
          } finally {
            setLoading(false);
          }
        };

        fetchComments();
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [isOpen, postId, commentPostedTrigger]);

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  }

  const csrftoken = getCookie('csrftoken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/comments/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
          post: postId,
          text: comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error submitting comment');
      } else {
        setComment('');
        onCommentAdded?.();
        setCommentPostedTrigger((prev) => prev + 1);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleInput = (e) => {
    const el = e.target;

    if (el.value.length > max_chars) {
      el.value = el.value.slice(0, max_chars);
    }

    el.style.height = "auto";
    const lh = parseInt(getComputedStyle(el).lineHeight, 10) || 16;
    const maxHeight = lh * max_rows;
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";

    setComment(el.value);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>

        {/* Bottom Sheet Panel */}
        <div className="fixed inset-0 flex items-end">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="relative w-full h-[70vh] bg-white rounded-t-2xl shadow-xl flex flex-col pb-4">
              
              {/* Header Row */}
              <div className="relative flex items-center justify-center px-4 pt-4 pb-2">
                <DialogTitle className="text-lg font-semibold text-center w-full">
                    Comments
                </DialogTitle>
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close"
                >
                    <IoMdClose />
                </button>
                </div>

              {/* Content */}
              <div className="flex flex-col w-full gap-4 px-4 overflow-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                
                {/* Comment Input */}
                <form onSubmit={handleSubmit} className="relative flex w-full">
                  <textarea
                    ref={taRef}
                    maxLength={max_chars}
                    rows={1}
                    placeholder="Type your comment."
                    value={comment}
                    onInput={handleInput}
                    className="w-full resize-none overflow-hidden rounded-full border border-gray-300 p-2 pl-4 pr-12 text-black text-base focus:border-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-blue-500 transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <IoIosSend className="h-6 w-6" />
                  </button>
                </form>

                {/* Comment List */}
                <div className="flex-1 overflow-y-auto space-y-4 custom-scroll pr-1">
                  {loading ? (
                    <p className="text-gray-500 text-sm">Loading comments...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div
                          className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url(${comment.author?.profile_picture || '/default-avatar.jpg'})`,
                          }}
                        />
                        <div className="flex flex-col pr-6">
                          <h1 className="text-sm font-bold">{comment.author?.username || 'Unknown'}</h1>
                          <p className="text-md text-black">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
