import { useState, useRef, Fragment } from 'react'
import { Dialog, Transition, TransitionChild, DialogPanel } from '@headlessui/react'
import { motion } from 'framer-motion'
import { MdAddPhotoAlternate } from 'react-icons/md'
import { IoIosSend } from 'react-icons/io'
import { useUser } from '../../UserContext'

const MAX_IMAGES = 8

export default function PostSection({ eventSpaceId, onPostCreated }) {
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
    <>
      {/* inline trigger row */}
      <div className="h-24 flex gap-4 p-4 md:w-1/3 md:self-center md:mr-12">
        <div
          className="w-16 h-16 bg-gray-600 rounded-full bg-cover bg-center shrink-0"
          style={{
            backgroundImage: user?.profile_picture
              ? `url(https://api.memory-branch.com/${user.profile_picture})`
              : `url('/hs-4.jpg')`,
          }}
        />
        <textarea
          readOnly
          onClick={() => setOpen(true)}
          placeholder="Write something..."
          className="flex-1 cursor-pointer rounded-md bg-[#ece7e3] border border-primary p-4 resize-none focus:outline-none"
        />
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
              <DialogPanel className="w-full h-[70vh] bg-[#ece7e3] rounded-t-2xl p-6 shadow-xl flex flex-col">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                  <textarea
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    placeholder="Write something..."
                    rows={3}
                    className="w-full rounded-md bg-white border border-primary p-3 resize-none focus:outline-none"
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

                  <div className="mt-auto flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-1 text-primary"
                    >
                      <MdAddPhotoAlternate className="text-2xl" />
                      {files.length > 0 && `(${files.length})`}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={loading}
                      type="submit"
                      className="rounded-full p-3 bg-secondary text-white"
                    >
                      {loading ? '...' : <IoIosSend className="h-6 w-6" />}
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
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

