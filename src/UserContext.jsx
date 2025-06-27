import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from './config';

const UserContext = createContext();

export function useUser() { return useContext(UserContext); }

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch(`${API_URL}/api/auth/session/`, {
          method: 'GET',
          credentials: 'include',
          mode: 'cors',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (res.ok) {
          const data = await res.json();
          console.log('[DEBUG] Session fetched:', data);
          setUser(data);
        } else {
          console.log('[DEBUG] Session fetch failed:', res.status);
          setUser(null);
        }
      } catch (err) {
        console.error('[DEBUG] Error fetching session:', err);
        setUser(null);
      }
    }
    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}