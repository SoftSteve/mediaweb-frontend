import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const UserContext = createContext(null);
const API = 'https://softsteve.pythonanywhere.com';

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---- fetch session helper ---- */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/session/`, {
        credentials: 'include',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        // 401/403 means no active session
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---- logout helper ---- */
  const logoutUser = async () => {
    await fetch(`${API}/api/auth/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });
    setUser(null);
  };

  /* ---- initial load ---- */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /* ---- context value ---- */
  const value = { user, setUser, refreshUser, logoutUser, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}