import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from './config.js';

const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (document.cookie.includes('sessionid=')) {
      fetch(`${API_URL}/api/auth/session/`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.debug('[UserContext] Rehydrated session:', data);
          setUser(data);
        })
        .catch((err) => {
          console.debug('[UserContext] No valid session:', err);
          setUser(null);
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}