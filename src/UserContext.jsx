import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  const getCsrf = () =>
    (document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/)?.[1] || '');

  useEffect(() => {
    (async () => {
      await fetch('https://api.memory-branch.com/api/get_csrf_token/', {
        credentials: 'include',
      });

      try {
        const res = await fetch(
          'https://api.memory-branch.com/api/auth/session/',
          { credentials: 'include' }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, getCsrf }}>
      {children}
    </UserContext.Provider>
  );
}