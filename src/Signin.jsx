import { motion } from 'framer-motion';
import Divider from '@mui/material/Divider';
import { GoogleIcon, FacebookIcon, GuestIcon } from './components/CustomIcons.tsx';
import IconButton from './components/IconButton.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ChoiceModal from './components/SignIn/CreateAccountModal.jsx';
import { useState, useEffect } from 'react';
import { useUser } from './UserContext.jsx';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";


export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [csrfReady, setCsrfReady] = useState(false);
  const location = useLocation();
  const spaceCode = location.state?.spaceCode;
  const navigate = useNavigate();
  const { setUser } = useUser();

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }

  useEffect(() => {
    fetch('https://softsteve.pythonanywhere.com/api/csrf/', {
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(res => {
        if (res.ok) {
          const token = getCsrfTokenFromCookie();
          if (token) {
            setCsrfReady(true);
          }
        }
      })
      .catch(() => {
        setError('Failed to load CSRF token.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const csrfToken = getCsrfTokenFromCookie();
    if (!csrfToken) {
      setError('CSRF token missing');
      return;
    }

    try {
      const res = await fetch('https://softsteve.pythonanywhere.com/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!res.ok) {
        setError('Email or password is incorrect.');
        return;
      }

      const userRes = await fetch('https://softsteve.pythonanywhere.com/api/auth/session/', {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!userRes.ok) {
        setError('Failed to fetch user session.');
        return;
      }

      const userData = await userRes.json();
      setUser(userData);

      if (spaceCode) {
        const res = await fetch(`https://softsteve.pythonanywhere.com/api/space-lookup/?code=${spaceCode}`, {
          credentials: 'include',
          headers: {
            'X-CSRFToken': getCsrfTokenFromCookie(),
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        if (res.ok) {
          const data = await res.json();
          navigate(`/space/${data.event_id}`);
          return;
        } else {
          navigate('/');
          return;
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (!csrfReady) return <div className="text-white p-4">Loading security...</div>;

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
