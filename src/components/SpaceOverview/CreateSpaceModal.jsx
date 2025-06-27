import { Dialog, DialogPanel, DialogTitle,  Field, Fieldset, Input, Label, Legend, Select, Textarea, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { BsMap, BsPeopleFill } from 'react-icons/bs';


export default function CreateModal({ handleSpaceCreated, isOpen, onClose }) {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [spaceName, setSpaceName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
      setCoverImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    document.getElementById('imageInput').value = '';
  };

  const handleClose = () => {
    if (fileRef.current) fileRef.current.value = '';
      onClose();
      setSpaceName('');
      setCoverImageFile(null);
      setCoverImage(null);
      
  }

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }

  const csrftoken = getCsrfTokenFromCookie();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!spaceName || !coverImageFile) {
    setError('please add a name and a cover image');
    return;
  }

  const formData = new FormData();
  formData.append('name', spaceName);
  formData.append('original_cover_image', coverImageFile);
  console.log('🔍 DEBUG formData', { spaceName, coverImageFile });

  let response;

  try {
    response = await fetch('https://softsteve.pythonanywhere.com/api/eventspace/', {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: { 'X-CSRFToken': csrftoken },
    });

    console.log('🔍 DEBUG fetch returned', response.status);

    if (response.status === 401 || response.status === 403) {
      console.log('🔍 DEBUG must sign in – navigating');
      navigate('/sign-in');
      return;
    }

    if (!response.ok) {
      const text = await response.text();
      console.log('🔍 DEBUG server 4xx/5xx', response.status, text);
      let data;
      try { data = JSON.parse(text); } catch { data = { detail: text }; }
      setError(
        typeof data === 'object'
          ? JSON.stringify(data, null, 2)
          : data || `Server error (${response.status})`
      );
      return; 
    }

  } catch (err) {
    setError('Network error: ' + err.message);
  } finally {

    if (response?.ok) {
      const newSpace = await response.json();
      handleSpaceCreated?.(newSpace)
      handleClose()
    } 
  }
};


  return (
   <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 text-secondary"
        onClose={onClose}
      >
        {/* ─── Overlay ────────────────────────────────────── */}
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

        {/* ─── Bottom-sheet wrapper ───────────────────────── */}
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
            {/* Panel: 70 vh tall, flex column */}
            <DialogPanel className=" relative w-full bg-white rounded-t-2xl shadow-xl flex flex-col">

              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
              >
                <IoMdClose />
              </button>
              {/* ▾ Handle + title  (non-scrolling) */}
              <div className="flex-shrink-0 px-4 py-6">
                <div className='flex w-full h-fit justify-center items-center pb-2'>
                    <div className="relative text-primary-500">
                      <BsMap className="text-4xl" />
                      <BsPeopleFill className="absolute inset-0 m-auto text-xl" />
                    </div>
                </div>

                <DialogTitle className="text-2xl font-semibold text-center">
                  Create Event Space
                </DialogTitle>

                <h1 className='text-lg text-gray-500 text-center'>Enter info for your event space</h1>
              </div>

              {/* ▾ Scrollable content */}
              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ─── Name ─────────────────────────────── */}
                  <fieldset>
                    <input
                      type="text"
                      className=" mt-1 w-full border px-3 py-3 rounded-xl border-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Space Name"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      required
                    />
                  </fieldset>

                  {/* ─── Cover image ──────────────────────── */}
                  <fieldset className="relative">
                    <label
                      htmlFor="imageInput"
                      className="mt-1 w-full h-60 bg-gray-200 border-2 border border-gray-400 rounded-xl cursor-pointer flex flex-col items-center justify-center"
                    >
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt="Preview"
                          className="object-cover w-full h-full rounded-xl"
                        />
                      ) : (
                        <>
                          <FaPlus className="text-3xl" />
                          <p>Add Cover Image</p>
                        </>
                      )}
                    </label>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                    {coverImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </fieldset>

                  {error && <p className="text-red-600">{error}</p>}

                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-primary text-white rounded-lg"
                    >
                      Create
                    </button>
        
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}