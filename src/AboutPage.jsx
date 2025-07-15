import { DialogPanel, Dialog, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { IoIosSend } from "react-icons/io";
import { useState, useRef, Fragment } from 'react';
import { X } from 'lucide-react';
import { IoShareOutline, IoAdd, IoImagesOutline } from "react-icons/io5";
import CustomSpinner from "./components/CustomSpinner"; // Remove this import if not previewing spinner
import { IoMdArrowUp } from "react-icons/io";
import Divider from '@mui/material/Divider';


export default function AboutPage() {
  const [open, setOpen] = useState(false);

  // placeholder state just to avoid errors in design phase
  const files = [];
  const caption = "";
  const loading = false;
  const fileRef = useRef(null);

  return (
    <div className='flex mt-40 flex-col'>
      <div className="bg-white p-3 pr-8 flex flex-row flex-nowrap justify-center items-center gap-3
                      md:w-1/3 md:self-center md:mr-12 transition-all duration-200">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-primary text-white font-medium rounded-full px-4 py-2 hover:shadow-md hover:bg-primary/90 transition-all duration-150"
        >
          <IoAdd className="text-2xl"/>
          Create Post
        </button>

        <button
          className="flex items-center gap-2 bg-surface text-secondary font-medium rounded-full px-4 py-2 hover:shadow-md hover:bg-surface/80 transition-all duration-150"
        >
          <IoShareOutline className="text-xl"/>
          Share Space
        </button>
      </div>

      {/* modal */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
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
              <DialogPanel className="w-full h-[90vh] bg-white p-6 shadow-xl flex flex-col rounded-t-2xl">

                {/* top bar */}
                <div className="relative mb-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl"
                  >
                    <X />
                  </button>

                  <DialogTitle className="text-xl font-lg">Create Post</DialogTitle>

                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 bg-blue-500 text-white"
                  >
                    {loading ? <CustomSpinner size={24} /> : <IoMdArrowUp className="h-5 w-5" />}
                  </button>
                </div>

                <form className="flex flex-col gap-4 h-full">
                  <textarea
                    placeholder="Your caption..."
                    rows={3}
                    className="w-full h-1/3 rounded-md bg-white p-3 text-lg focus:outline-none"
                  />
                  <Divider orientation="horizontal" variant="fullWidth"/>

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
                      className="flex items-center gap-1 text-blue-500"
                    >
                      <IoImagesOutline className="text-3xl" />
                      {files.length > 0 && `(${files.length})`}
                    </button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileRef}
                    className="hidden"
                  />
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
