import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react';
import { Fragment } from 'react';
import IconButton from '../IconButton';
import { MdOutlineFileDownload } from 'react-icons/md';
import { FaRegTrashCan } from "react-icons/fa6";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '../../UserContext';


function getProxyUrl(url) {
  try {
    const apiBase = "https://api.memory-branch.com";
    const path = new URL(url).pathname;
    return `${apiBase}/media${path}`;
  } catch (err) {
    return url; // fallback
  }
}

export default function PostOptions({ isOpen, onClose, postId, onDeletePost, images = [] }) {
  const { user } = useUser();
  const isAuthor = user?.id === images?.[0]?.author?.id;

  const handleClick = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDeletePost(postId);
    }
  };

  const handleDownloadImages = async () => {
    try {
      const zip = new JSZip();
      const folder = zip.folder(`post-${postId}`);

      const fetches = images.map((imgObj, i) =>
        fetch(getProxyUrl(imgObj.image), {
          mode: 'cors',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch image ${i + 1}`);
            return res.blob();
          })
          .then((blob) => {
            const ext = blob.type.split('/')[1] || 'jpg';
            folder.file(`image-${i + 1}.${ext}`, blob);
          })
      );

      await Promise.all(fetches);

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `post-${postId}-images.zip`);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Some images could not be downloaded due to CORS restrictions.');
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 flex items-end justify-center">
          <TransitionChild
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="w-full bg-white rounded-t-2xl px-4 py-6 shadow-xl md:w-1/5">
              <div
                className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"
                onClick={onClose}
              />
              <div className="space-y-3">
                <IconButton
                  icon={<MdOutlineFileDownload className="text-2xl text-blue-500" />}
                  text="Download Images"
                  onClick={handleDownloadImages}
                />
                {isAuthor && (
                  <IconButton
                    icon={<FaRegTrashCan className="text-xl text-red-500" />}
                    text="Delete Post"
                    onClick={handleClick}
                  />
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
