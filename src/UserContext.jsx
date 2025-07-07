import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

/* ---------------------------------------------
 * Helper: read csrftoken from cookie
 * -------------------------------------------*/
const getCsrfToken = () => {
  const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Always ensure we have a CSRF cookie first
    const ensureCsrf = async () => {
      if (!getCsrfToken()) {
        try {
          await fetch('https://api.memory-branch.com/api/get_csrf_token/', {
            credentials: 'include',
          });
        } catch (err) {
          console.warn('[UserContext] Could not obtain CSRF cookie', err);
        }
      }
    };

    const fetchSession = async () => {
      if (!document.cookie.includes('sessionid=')) {
        setUser(null);
        return;
      }

      await ensureCsrf();
      const csrfToken = getCsrfToken();

      try {
        const res = await fetch('https://api.memory-branch.com/api/auth/session/', {
          credentials: 'include',
          headers: csrfToken ? { 'X-CSRFToken': csrfToken } : {},
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        console.debug('[UserContext] Rehydrated session:', data);
        setUser(data);
      } catch (err) {
        console.debug('[UserContext] No valid session:', err);
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}