import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PreviewJoin from './components/PreviewJoin';

export default function JoinRoute() {
  const { code } = useParams();
  const [eventData, setEventData] = useState(null);
  const [spaceCode, setSpaceCode] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.memory-branch.com/api/space-lookup/?code=${encodeURIComponent(code)}`,
          { credentials: 'include' }
        );
        const lookup = await res.json();

        if (!res.ok || !lookup.event_id) {
          setNotFound(true);
          return;
        }

        // Now fetch full event data
        const eventRes = await fetch(
          `https://api.memory-branch.com/api/eventspace/${lookup.event_id}/`,
          { credentials: 'include' }
        );

        const fullEvent = await eventRes.json();
        if (eventRes.ok) {
          setEventData(fullEvent);
          setSpaceCode(code);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
    })();
  }, [code]);

  if (notFound) return <>Not found.</>;
  if (!eventData) return <>Loading…</>;

  return <PreviewJoin space={eventData} spaceCode={spaceCode} />;
}