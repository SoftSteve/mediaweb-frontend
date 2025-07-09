import { useState, useRef, Fragment } from 'react'
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react'
import { MdAddPhotoAlternate } from 'react-icons/md'
import { IoIosSend } from 'react-icons/io'
import { useUser } from '../../UserContext'
import { X } from 'lucide-react'


const MAX_IMAGES = 8

export default function PostSection({ eventSpaceId, onPostCreated, spaceCode }) {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()
  const { user } = useUser()
  const shareUrl  = `${window.location.origin}/join/${spaceCode}`

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my Memory Branch space',
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard')
      }
    } catch (err) {
      console.error('Share cancelled', err)
    }
  }

  const getCsrf = () =>
    document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || ''

  const handleFileChange = e => {
    let selected = Array.from(e.target.files)
    if (selected.length > MAX_IMAGES) selected = selected.slice(0, MAX_IMAGES)
    setFiles(selected)
    if (fileRef.current) fileRef.current.value = null
  }

  const reset = () => {
    setCaption('')
    setFiles([])
    setOpen(false)
  }

  const handleSubmit = async e => {
    e?.preventDefault()
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
        onPostCreated(newPost)
        reset()
      } else alert('Upload failed.')
    } catch {
      alert('Network error – try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className="flex flex-row flex-nowrap justify-center items-center gap-2
                      px-4 overflow-x-auto
                      md:w-1/3 md:self-center md:mr-12">
        <div
          className="w-12 h-12 bg-gray-600 rounded-full bg-cover bg-center shrink-0"
          style={{
            backgroundImage: user?.profile_picture
              ? `url(https://api.memory-branch.com/${user.profile_picture})`
              : `url('/hs-4.jpg')`,
          }}
        />
        <button
            onClick={() => setOpen(true)}
            className="flex-none bg-secondary rounded-full px-4 py-2 text-white">
            Create Post
        </button>

        <button
            onClick={handleShare}
            className="flex-none bg-surface rounded-full px-4 py-2 text-secondary">
            Share Space
        </button>
      </div>

      {/* modal */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={reset}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </TransitionChild>

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
              <DialogPanel className="w-full h-full bg-white p-6 shadow-xl flex flex-col">

                {/* top bar */}
                <div className="relative mb-4 flex items-center justify-center">
                    {/* close */}
                    <button
                    type="button"
                    onClick={reset}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl"
                    >
                    <X />
                    </button>

                    <DialogTitle className="text-xl font-lg ">Create Post</DialogTitle>

                    <button
                    type="submit"
                    form="postForm"
                    disabled={loading}
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 bg-blue-500 text-white"
                    >
                    {loading ? '...' : <IoIosSend className="h-5 w-5" />}
                    </button>
                </div>

                <form id="postForm" onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                    <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Write your caption..."
                    rows={3}
                    className="w-full rounded-md bg-white p-3 text-lg focus:outline-none"
                    />

                    {files.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {files.map((f, i) => (
                        <img
                            key={i}
                            src={URL.createObjectURL(f)}
                            alt=""
                            className="h-24 w-full object-cover rounded-md"
                        />
                        ))}
                    </div>
                    )}

                    <div className="mt-auto">
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-1 text-blue-500"
                    >
                        <MdAddPhotoAlternate className="text-4xl" />
                        {files.length > 0 && `(${files.length})`}
                    </button>
                    </div>

                    <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileRef}
                    onChange={handleFileChange}
                    className="hidden"
                    />
                </form>
                </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

