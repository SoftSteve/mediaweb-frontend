import { motion } from 'framer-motion';
import Input from './components/TextInput';
import { Mail, User, Lock } from 'lucide-react'; 
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import { API_URL } from './config';

export default function CreateAccount() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const spaceCode = useLocation().state?.spaceCode
  const { setUser } = useUser();

  function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('email', email);

  try {
    const response = await fetch(`https://api.memory-branch.com/api/auth/create-account/`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfTokenFromCookie(),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Account creation failed');
    }

    const userRes = await fetch(`https://api.memory-branch.com/api/auth/session/`, {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!userRes.ok) {
      throw new Error('Could not fetch user session.');
    }

    const userData = await userRes.json();
    setUser(userData);

    if (spaceCode) {
      const res = await fetch(`https://api.memory-branch.com/api/space-lookup/?code=${spaceCode}`, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (res.ok) {
        const { event_id } = await res.json();
        return navigate(`/space/${event_id}`);
      } else {
        return navigate('/spaces'); 
      }
    }

    navigate('/');
  } catch (err) {
    setError(err.message || 'An unexpected error occurred.');
  }
};

  return (
    <div className="flex flex-col w-full min-h-screen px-6 mt-20 bg-[#ece7e3]">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <h3 className="text-md text-gray-500">Create an account to get started</h3>
      </div>
      <div className="w-full py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="username"
            required
            placeholder="username*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            name="email"
            required
            placeholder="email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          {error && <p className="text-red-500">{error}</p>}
          <motion.input
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            type="submit"
            value="Create Account"
            className="w-full p-3 bg-secondary text-white rounded-2xl mt-4"
          />
        </form>
      </div>
    </div>
  );
}
