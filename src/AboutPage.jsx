import { DialogPanel, Dialog, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IoIosSend } from "react-icons/io";


export default function AboutPage() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 mt-20 bg-blue-600 text-white rounded-md"
      >
        Open Modal
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          {/* Bottom Sheet Panel */}
          <div className="fixed inset-0 flex items-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="relative w-full h-[70vh] bg-white rounded-t-2xl shadow-xl flex flex-col">
                {/* Drag Handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                {/* Modal Title */}
                <Dialog.Title className="text-lg font-semibold text-center mb-2">
                  Comments
                </Dialog.Title>

                {/* Example Content */}
                <div className="flex flex-col w-full gap-4 overflow-auto pr-1" style={{ maxHeight: 'calc(80vh - 140px)' }}>
                  <form className="relative flex w-full">
                    <textarea
                      maxLength={250}
                      rows={1}
                      placeholder="Type your comment."
                      className="w-full resize-none overflow-hidden rounded-full border
                                 box-border border-gray-300 p-2 pl-4 pr-12 text-black text-base
                                 focus:border-black focus:outline-none"
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2
                                 text-blue-500 transition hover:bg-blue-100 focus:outline-none
                                 focus:ring-2 focus:ring-blue-500"
                    >
                      <IoIosSend className="h-6 w-6" />
                    </button>
                  </form>

                  <div className="flex-1 overflow-y-auto px-4 space-y-4">
                    <div className="flex flex-row w-full gap-2 items-start">
                      <div
                        className="bg-primary min-w-10 min-h-10 rounded-full shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/default-avatar.jpg')` }}
                      ></div>
                      <div className="flex flex-col pr-6">
                        <h1 className="text-sm font-bold">Username</h1>
                        <h1 className="text-md text-black">This is a sample comment text.</h1>
                      </div>
                    </div>

                    <div className="flex flex-row w-full gap-2 items-start">
                      <div
                        className="bg-primary min-w-10 min-h-10 rounded-full shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('/default-avatar.jpg')` }}
                      ></div>
                      <div className="flex flex-col pr-6">
                        <h1 className="text-sm font-bold">AnotherUser</h1>
                        <h1 className="text-md text-black">Another example comment for layout testing.</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}