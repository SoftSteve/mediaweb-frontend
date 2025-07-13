import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PreviewJoin from './components/PreviewJoin';

export default function JoinRoute() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.memory-branch.com/api/space-preview/?code=${encodeURIComponent(code)}`
        );

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        const lookup = await res.json();

        if (!lookup.event_id) {
          setNotFound(true);
          return;
        }

        const eventRes = await fetch(
          `https://api.memory-branch.com/api/eventspace/${lookup.event_id}/`
        );

        if (!eventRes.ok) {
          setNotFound(true);
          return;
        }

        const fullEvent = await eventRes.json();
        setEventData(fullEvent);
      } catch (error) {
        console.error('Fetch error:', error);
        setNotFound(true);
      }
    })();
  }, [code]);

  if (notFound) {
    return <div className="p-4 text-center text-red-600">Space not found.</div>;
  }
  if (!eventData) return <div className="p-4 text-center">Loading…</div>;

  return <PreviewJoin event={eventData} spaceCode={code} />;
}