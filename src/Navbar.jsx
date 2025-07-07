import { useState, useRef, useEffect } from 'react';
import { BiMenuAltRight } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import { MdPersonOutline } from "react-icons/md";
import { IoMdPersonAdd } from "react-icons/io";
import { PiSignOutLight } from "react-icons/pi";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftToLine } from 'lucide-react';
import { useUser } from './UserContext';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  async function handleLogout() {
    console.log('[DEBUG] Attempting logout...');

    try {
      const res = await fetch('https://api.memory-branch.com/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfTokenFromCookie(),
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      console.log('[DEBUG] Logout response status:', res.status);
      const data = await res.json().catch(() => ({}));
      console.log('[DEBUG] Logout response data:', data);

      if (res.ok) {
        setUser(null);
        setMenuOpen(false);
        navigate('/');
      } else {
        console.error('[DEBUG] Logout failed:', data);
      }
    } catch (err) {
      console.error('[DEBUG] Network error on logout:', err);
    }
  }

  function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="h-20 flex justify-between items-center px-8 fixed top-0 left-0 w-full z-50 text-primary bg-[#ece7e3]">
      <Link to='/' className="text-2xl font-bold">Website</Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex px-6">
        <Link to='/' onClick={() => setMenuOpen(false)} className="md:pr-12 text-lg font-medium">Home</Link>
        <Link to='/spaces' onClick={() => setMenuOpen(false)} className="md:pr-12 text-lg font-medium">Spaces</Link>
        {user ? (
          <button onClick={handleLogout} className="md:pr-12 text-lg font-medium text-left">Sign out</button>
        ) : (
          <Link to='/sign-in' onClick={() => setMenuOpen(false)} className="md:pr-12 text-lg font-medium">Sign in</Link>
        )}
        <Link to='/about' onClick={() => setMenuOpen(false)} className="md:pr-12 text-lg font-medium">About</Link>
      </ul>

      {/* Hamburger Icon */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <ArrowLeftToLine size={28} /> : <BiMenuAltRight size={32} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div ref={menuRef} className="h-screen flex flex-col fixed top-0 left-0 w-4/5 shadow-xl md:hidden z-40" initial={{ x: -400 }} animate={{ x: 0 }} exit={{ x: -400 }} transition={{ duration: 0.3, type: 'spring', damping: 40, stiffness: 500 }}>
            <div className='flex flex-row bg-primary h-24 justify-between items-center p-4 pt-10'>
              <div className='flex flex-row gap-2 items-center'>
                <div className='w-12 h-12 rounded-full bg-cover bg-center bg-gray-600'
                  style={{
                    backgroundImage: user?.profile_picture
                      ? `url(https://api.memory-branch.com/${user.profile_picture})`
                      : `url('/hs-4.jpg')`,
                  }}
                ></div>
                <Link to='/account-settings' onClick={() => setMenuOpen(false)} className="flex flex-row gap-6 md:pr-12 text-lg font-medium">
                  <h1 className='text-md text-white'>
                    {user ? `${user.username}` : 'Guest'}
                  </h1>
                </Link>
                
              </div>
              <div className='flex flex-row items-center gap-1'>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="md:pr-12 text-md text-white"
                  >
                    <PiSignOutLight className='text-2xl'/>
                  </button>
                ) : (
                  <Link
                    to='/sign-in'
                    onClick={() => setMenuOpen(false)}
                    className="md:pr-12 text-md text-white"
                  >
                    <IoMdPersonAdd className='text-2xl'/>
                  </Link>
                )}
              </div>
            </div>
            <ul className="h-full flex flex-col w-full border border-border bg-[#ece7e3] py-6 px-6 gap-10 shadow-xl">
              <Link to='/' onClick={() => setMenuOpen(false)} className="flex flex-row gap-6 md:pr-12 text-lg font-medium"><h1>Home</h1></Link>
              <Link to='/spaces' onClick={() => setMenuOpen(false)} className="flex flex-row gap-6 items-center md:pr-12 text-lg font-medium"><h1>Spaces</h1></Link>
              <Link to='/materials' onClick={() => setMenuOpen(false)} className="flex flex-row gap-6 items-center md:pr-12 text-lg font-medium"><h1>Event Materials</h1></Link>
              <Link to='/about' onClick={() => setMenuOpen(false)} className="flex flex-row gap-6 items-center md:pr-12 text-lg font-medium"><h1>About</h1></Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
