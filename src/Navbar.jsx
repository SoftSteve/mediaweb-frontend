// src/components/NavBar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiMenuAltRight } from 'react-icons/bi';
import { ArrowLeftToLine } from 'lucide-react';
import { IoMdPersonAdd } from 'react-icons/io';
import { PiSignOutLight } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './UserContext';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser, loading } = useUser();  
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <nav className={`h-20 flex justify-between items-center px-8 fixed top-0 left-0 w-full z-50 text-primary bg-[#ece7e3] transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
      <div className='flex flex-row items-center gap-1'>
        <Link to="/" className="w-10 h-10 rounded-full bg-cover bg-center bg-gray-600"
        style={{
          backgroundImage: `url('/logocirc.png')`
        }}>
      </Link>
      <h1 className='text-2xl font-semibold text-black'>
        MemoryBranch
      </h1>
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
        {menuOpen ? <ArrowLeftToLine size={28} /> : <BiMenuAltRight size={32} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="h-screen flex flex-col fixed top-0 left-0 w-4/5 shadow-xl md:hidden z-40"
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
                <button onClick={handleLogout} className="text-white">
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
    </nav>
  );
}
