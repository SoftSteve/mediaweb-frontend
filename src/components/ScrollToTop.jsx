import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use 'auto' instead of 'smooth' to avoid interfering with page transitions
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}