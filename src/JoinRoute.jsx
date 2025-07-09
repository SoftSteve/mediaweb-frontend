import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JoinRoute() {
  const { code }  = useParams();
  const navigate  = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(
          `https://api.memory-branch.com/api/space-lookup/?code=${encodeURIComponent(code)}`,
          { credentials: 'include' }
        );
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.event_id) {
          navigate(`/space/${data.event_id}`, { replace: true });
        } else {
          navigate('/not-found', { replace: true });
        }
      } catch {
        navigate('/not-found', { replace: true });
      }
    })();
  }, [code, navigate]);

  return null;           // or a spinner component
}