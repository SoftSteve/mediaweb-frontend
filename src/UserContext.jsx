import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log('[DEBUG] Starting fetch for user session');
        const res = await fetch('https://softsteve.pythonanywhere.com/api/auth/session/', {
          credentials: 'include',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        
        console.log('[DEBUG] Fetch response status:', res.status);
        console.log('[DEBUG] Fetch response headers:', [...res.headers.entries()]);

        if (!res.ok) {
          console.warn('[DEBUG] Session fetch failed with status', res.status);
          const text = await res.text();
          console.log('[DEBUG] Response body:', text);
          setUser(null);
          return;
        }

        const data = await res.json();
        console.log('[DEBUG] Session user data:', data);
        setUser(data);

        // Check cookies available in document.cookie (for debugging in browser)
        console.log('[DEBUG] document.cookie:', document.cookie);
      } catch (err) {
        console.error('[DEBUG] Error fetching session:', err);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}