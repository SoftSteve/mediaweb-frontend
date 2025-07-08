import { useState, useRef, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { MdAddPhotoAlternate } from 'react-icons/md'
import { X } from 'lucide-react'
import { useUser } from './UserContext'

const MAX_IMAGES = 8
export default function AboutPage() {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState([])
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)
    const fileRef = useRef()
    const { user } = useUser()

    const getCsrf = () =>
        document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || ''

    const handleFileChange = e => {
        let selected = Array.from(e.target.files)
        if (selected.length > MAX_IMAGES) selected = selected.slice(0, MAX_IMAGES)
        setFiles(selected)
        if (fileRef.current) fileRef.current.value = null
    }

    const handleSubmit = async () => {
        if (!caption && files.length === 0) return
        setLoading(true)

        const fd = new FormData()
        fd.append('caption', caption)
        fd.append('event_space', eventSpaceId)
        files.forEach(f => fd.append('images', f))

        try {
        const res = await fetch('https://api.memory-branch.com/api/posts/', {
            method: 'POST',
            body: fd,
            credentials: 'include',
            headers: { 'X-CSRFToken': getCsrf() },
        })
        const newPost = await res.json().catch(() => null)
        if (res.ok && newPost) {
            setCaption('')
            setFiles([])
            onPostCreated(newPost)
            setOpen(false)
        } else alert('Upload failed.')
        } catch {
        alert('Network error – try again.')
        } finally {
        setLoading(false)
        }
    }

    return (
        <>
        <button
            onClick={() => setOpen(true)}
            className="w-full text-lg py-2 text-white bg-secondary rounded-lg"
        >
            Create post
        </button>

        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/40" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-md transform rounded-xl bg-[#ece7e3] p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-xl font-semibold">
                        New Post
                        </Dialog.Title>
                        <button onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                        </button>
                    </div>

                    <textarea
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Write something…"
                        rows={3}
                        className="w-full mb-4 p-3 rounded-md bg-white border border-primary resize-none focus:outline-none"
                    />

                    {files.length > 0 && (
                        <div className="mb-4 grid grid-cols-3 gap-2">
                        {files.map((file, i) => (
                            <img
                            key={i}
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="h-24 w-full object-cover rounded-md"
                            />
                        ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileRef.current?.click()}
                        type="button"
                        className="flex items-center gap-1 text-primary"
                        >
                        <MdAddPhotoAlternate className="text-2xl" />
                        {files.length > 0 && `(${files.length})`}
                        </motion.button>

                        <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-md bg-secondary text-white"
                        >
                        {loading ? 'Posting…' : 'Post'}
                        </motion.button>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
        </>
    )
    }