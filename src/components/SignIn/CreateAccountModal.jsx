import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { GoogleIcon, FacebookIcon } from '../CustomIcons.tsx'
import IconButton from '../IconButton.jsx'
import { MdEmail } from 'react-icons/md';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from 'lucide-react';


export default function ChoiceModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const { state } = useLocation();     
  const spaceCode = state?.spaceCode;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
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
            <DialogPanel className="w-full bg-white rounded-t-2xl px-4 py-6 shadow-xl">
              {/* Drag Handle */}
              <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

              {/* Modal Title */}
              <DialogTitle className="text-lg font-semibold text-center mb-2">
                Create an account
              </DialogTitle>

              {/* Example Content */}
              <div className="space-y-3">
                <IconButton
                    icon={<GoogleIcon/>}
                    text='Sign up with Google'
                />
                <IconButton
                  icon={<MdEmail className='text-2xl'/>}
                  text='Sign up with email'
                  onClick={() => navigate('/sign-up', {state: {spaceCode}})}
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
