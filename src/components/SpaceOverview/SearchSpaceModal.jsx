import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { BsMap, BsPeopleFill} from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io';
import { API_URL } from "../../config";

export default function SearchSpaceModal({isOpen, onClose}) {
    const [spaceCode, setSpaceCode] = useState('');
    const [error, setError] = useState('');
    const navigate   = useNavigate();
    const location   = useLocation();
    
    const getCsrfTokenFromCookie = () => {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? match[1] : null;
    };

    const lookupSpace = async (code) => {
        try {
        const response = await fetch(
            `https://api.memory-branch.com/api/space-lookup/?code=${code}`,
            {
            credentials: 'include',
            headers: { 'X-CSRFToken': getCsrfTokenFromCookie() },
            }
        );

        if (response.status === 401 || response.status === 403) {
            navigate('/sign-in', { state: { spaceCode: code } });
            return;
        }

        const data = await response.json();

        if (response.ok && data.event_id) {
            navigate(`/space/${data.event_id}`);
        } else {
            setError(data.error || 'An error occurred');
        }
        } catch (err) {
        console.error(err);
        setError('Failed to connect to server');
        }
    };

    const handleClose = () => {
      onClose();
      setSpaceCode('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        lookupSpace(spaceCode);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code   = params.get('spaceCode');
        if (!code) return;

        setSpaceCode(code);  
        setError('');
        lookupSpace(code);        
    }, [location.search]);

    return(
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
                      <div className="flex-shrink-0 px-4 py-6 flex flex-col">

                        <div className='flex w-full h-fit justify-center items-center pb-2'>
                            <div className="relative text-primary-500">
                              <BsMap className="text-4xl" />
                              <BsPeopleFill className="absolute inset-0 m-auto text-xl" />
                            </div>
                        </div>

                        <DialogTitle className="text-2xl font-semibold text-center">
                          Find an Event Space
                        </DialogTitle>
                        <h1 className="text-lg text-gray-500 text-center">Enter an event code to find an event.</h1>
                      </div>
        
                      {/* ▾ Scrollable content */}
                      <div className="flex-1 overflow-y-auto px-6 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          {/* ─── Name ─────────────────────────────── */}
                          
                            <input
                                type="text"
                                className="w-full border p-3 rounded-xl mt-1 border-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Event Code"
                                value={spaceCode}
                                onChange={(e) => setSpaceCode(e.target.value)}
                                required
                            />
        
                          {error && <p className="text-red-600">{error}</p>}
        
                            <button
                              type="submit"
                              className="w-full px-6 py-3 bg-primary text-white rounded-lg"
                            >
                              Find Space
                            </button>
                        </form>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </Dialog>
            </Transition>
    )
}