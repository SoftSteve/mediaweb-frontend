// src/Signin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Divider from '@mui/material/Divider';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { API_URL } from './config.js';         // ← Import API_URL
import { useUser } from './UserContext.jsx';
import ChoiceModal from './components/SignIn/CreateAccountModal.jsx';
import IconButton from './components/IconButton.jsx';
import { GoogleIcon } from './components/CustomIcons.tsx';

export default function Signin() {
  /* ───────────────────── state ───────────────────── */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [csrfReady, setCsrfReady] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const spaceCode = location.state?.spaceCode;
  const { setUser } = useUser();

  /* ───────────────────── fetch CSRF once ───────────────────── */
  useEffect(() => {
    fetch(`${API_URL}/api/csrf/`, {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
      .then((r) => r.json())
      .then(({ csrfToken }) => {
        if (csrfToken) {
          setCsrfToken(csrfToken);
          setCsrfReady(true);
        } else {
          setError('Could not obtain CSRF token.');
        }
      })
      .catch(() => setError('Network error while fetching CSRF token.'));
  }, []);

  /* ───────────────────── form submit ───────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!csrfToken) {
      setError('CSRF token missing. Please refresh the page.');
      return;
    }

    // ← Declare loginRes here
    const loginRes = await fetch(`${API_URL}/api/auth/login/`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      setError('Email or password is incorrect.');
      return;
    }

    /* pull session */
    const sessionRes = await fetch(`${API_URL}/api/auth/session/`, {
      credentials: 'include',
      mode: 'cors',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!sessionRes.ok) {
      setError('Failed to fetch user session.');
      return;
    }

    const userData = await sessionRes.json();
    setUser(userData);

    /* optional redirect via space code */
    if (spaceCode) {
      const lookup = await fetch(
        `${API_URL}/api/space-lookup/?code=${spaceCode}`,
        {
          credentials: 'include',
          mode: 'cors',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken,
          },
        }
      );
      if (lookup.ok) {
        const { event_id } = await lookup.json();
        navigate(`/space/${event_id}`);
        return;
      }
    }
    navigate('/');
  }

  /* ───────────────────── UI ───────────────────── */
  if (!csrfReady)
    return <div className="p-6 text-white">Loading security…</div>;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#ece7e3] mt-20">
      <div className="flex flex-col px-6 gap-2">
        <h1 className="text-2xl text-secondary font-semibold">Sign in</h1>
        <p className="text-md text-gray-500">Sign in to your account to get started.</p>
      </div>
      <div className="w-full p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="text"
            required
            placeholder="email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl p-3 border border-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl p-3 pr-12 border border-gray-400
                        focus:outline-none focus:border-blue-400 focus:ring-primary focus:ring-1"
            />

            {showPassword ? (
              <FaRegEye
                onClick={() => setShowPassword(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                          text-2xl text-gray-500 cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={() => setShowPassword(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                          text-2xl text-gray-500 cursor-pointer"
              />
            )}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <input
              type="checkbox"
              id="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-5 h-5"
            />
            <label htmlFor="checkbox">Remember me</label>
          </div>

          <button className="text-blue-500 self-start">forgot password?</button>

          {error && <p className="text-red-600">{error}</p>}

          <motion.input
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 600, damping: 10 }}
            name="submit"
            type="submit"
            value="Sign In"
            className="w-full p-3 bg-secondary text-white rounded-2xl cursor-pointer"
          />
        </form>

        <div className="flex flex-row my-4 gap-1 justify-center items-center">
          <p>Don't have an account?</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 cursor-pointer"
          >
            sign up.
          </button>
          <ChoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>

        <Divider sx={{ my: 4 }}>More Options</Divider>
        <div className="flex flex-col gap-4">
          <IconButton icon={<GoogleIcon />} text="Sign in with Google" />
        </div>
      </div>
    </div>
  );
}
