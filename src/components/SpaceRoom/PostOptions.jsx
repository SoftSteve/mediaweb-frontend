import { Dialog, Transition, TransitionChild, DialogPanel} from '@headlessui/react';
import { Fragment } from 'react';
import IconButton from '../IconButton';
import { MdOutlineFileDownload,  } from 'react-icons/md';
import { FaRegTrashCan } from "react-icons/fa6";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '../../UserContext';


export default function PostOptions({isOpen, onClose, postId, onDeletePost, images = []}) {
    const { user }  = useUser();
    const isAuthor = user?.id === images?.[0]?.author?.id;

    const handleClick = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
        onDeletePost(postId);
        }
    };

    const handleDownloadImages = () => {
        const zip = new JSZip()
        const folder = zip.folder(`post-${postId}`)

        const fetches = images.map((imgObj, i) =>
        fetch(imgObj.image)
            .then((res) => res.blob())
            .then((blob) => {
            const ext = blob.type.split('/')[1] || 'jpg'
            folder.file(`image-${i + 1}.${ext}`, blob)
            })
        )

        Promise.all(fetches).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `post-${postId}-images.zip`)
        })
        })
    }


    return(
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
                <div className="fixed inset-0 flex items-center justify-center">
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
                        <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" 
                            onClick={onClose}
                        />
                        <div className="space-y-3">
                        <IconButton
                            icon={<MdOutlineFileDownload className='text-2xl text-blue-500'/>}
                            text='Download Images'
                            onClick={handleDownloadImages}
                        />
                        <IconButton
                            icon={<FaRegTrashCan className='text-xl text-red-500'/>}
                            text='Delete Post'
                            onClick={handleClick}
                        />
                        </div>
                    </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
