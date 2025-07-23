import { useState, useRef, useEffect, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiMenuAltRight } from 'react-icons/bi';
import { ArrowLeftToLine } from 'lucide-react';
import { IoMdPersonAdd } from 'react-icons/io';
import { PiSignOutLight } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './UserContext';
import { IoArrowBack } from "react-icons/io5";
import { BiArrowBack } from "react-icons/bi";
import { Dialog, Transition, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, loading } = useUser();  
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getCsrfToken = () =>
    document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || '';

  const handleLogout = async () => {
    try {
      const csrf = getCsrfToken();
      if (!csrf) throw new Error('Missing CSRF token');

      const res = await fetch(
        'https://api.memory-branch.com/api/auth/logout/',
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-CSRFToken': csrf },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setUser(null);
      setMenuOpen(false);
      navigate('/');
    } catch (err) {
      console.error('[NavBar] Logout failed:', err);
    }
  };

  useEffect(() => {
    const handleOutside = (e) =>
      menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
  }, [lastScrollY]);

  useEffect(() => {
    const isOnEventPage =
      location.pathname.startsWith("/space/") &&
      location.pathname !== "/space";
    setShowBack(isOnEventPage);
  }, [location]);

  return (
    <nav className={`h-20 flex justify-between items-center ${showBack ? 'px-8' : 'pr-8'} fixed z-40 top-0 left-0 w-full bg-[#ece7e3] text-primary transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
      <div
        className={`relative z-10 flex items-center gap-2 cursor-pointer ${showBack ? '' : 'mt-4'}`}
        onClick={() => {
          if (showBack) {
            navigate(-1);
          } else {
            navigate('/');
          }
        }}
      >
        {showBack ? (
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="text-[#3F3F44] flex flex-row gap-2 items-center"
          >
            <BiArrowBack className="text-2xl" />
            <h1 className="text-xl">Home</h1>
          </motion.div>
        ) : (
          <div className="relative z-10 pl-4 flex justify-center">
            <img
              src="/final-logo.png"
              alt="MemoryBranch Logo"
              className="w-60 object-contain"
            />
            </div>
        )}
      </div>
      
      <ul className="hidden md:flex px-6">
        <li className="md:pr-12 text-lg font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li className="md:pr-12 text-lg font-medium">
          <Link to="/spaces" onClick={() => setMenuOpen(false)}>Spaces</Link>
        </li>

        {user ? (
          <li className="md:pr-12 text-lg font-medium">
            <button onClick={handleLogout}>Sign out</button>
          </li>
        ) : (
          <li className="md:pr-12 text-lg font-medium">
            <Link to="/sign-in" onClick={() => setMenuOpen(false)}>Sign in</Link>
          </li>
        )}

        <li className="md:pr-12 text-lg font-medium">
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </li>
      </ul>

      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <ArrowLeftToLine size={28} color='#3F3F44'/> : <BiMenuAltRight size={32} color='#3F3F44' />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="h-screen flex flex-col fixed top-0 left-0 z-[9999] w-4/5 shadow-xl md:hidden"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ duration: 0.3, type: 'spring', damping: 40, stiffness: 500 }}
          >
            {/* drawer header */}
            <div className="flex items-center justify-between bg-primary h-24 p-4 pt-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center bg-gray-600"
                  style={{
                    backgroundImage: user?.profile_picture
                      ? `url(https://api.memory-branch.com/${user.profile_picture})`
                      : `url('/hs-4.jpg')`,
                  }}
                />
                <Link
                  to="/account-settings"
                  onClick={() => setMenuOpen(false)}
                  className="text-md text-white"
                >
                  {user ? user.username : 'Guest'}
                </Link>
              </div>

              {user ? (
                <button onClick={() => setShowLogoutConfirm(true)} className="text-white">
                  <PiSignOutLight className="text-2xl" />
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={() => setMenuOpen(false)}
                  className="text-white"
                >
                  <IoMdPersonAdd className="text-2xl" />
                </Link>
              )}
            </div>

            {/* drawer links */}
            <ul className="flex flex-col gap-10 px-6 py-6 bg-[#ece7e3] h-full">
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              </li>
              <li>
                <Link to="/spaces" onClick={() => setMenuOpen(false)}>Spaces</Link>
              </li>
              <li>
                <Link to="/materials" onClick={() => setMenuOpen(false)}>Event Materials</Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <Transition
          appear
          show={showLogoutConfirm}
          as={Fragment}
        >
          <Dialog as="div" className="relative z-[99999]" onClose={() => setShowLogoutConfirm(false)}>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              {/* BACKDROP */}
              <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />

              {/* MODAL PANEL */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl"
              >
                <DialogTitle as="h3" className="text-lg font-medium text-center leading-6 text-gray-900">
                  Sign Out
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-center text-gray-500">
                    Are you sure you want to sign out?
                  </p>
                </div>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    className="px-4 py-2 bg-surface text-gray-800 rounded-xl hover:bg-gray-200"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-red-600"
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      handleLogout();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        </Transition>
    </nav>
  );
}
