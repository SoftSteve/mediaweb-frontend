import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PreviewJoin from './components/PreviewJoin';

export default function JoinRoute() {
  const { code } = useParams();
  const [space, setSpace] = useState(null);
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

        const data = await res.json();
        if (!data.event_id) {
          setNotFound(true);
          return;
        }

        setSpace(data);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
    })();
  }, [code]);

  if (notFound)  return <div className="p-4 text-center text-red-600">Space not found.</div>;
  if (!space)    return <div className="p-4 text-center">Loading…</div>;

  return <PreviewJoin space={space} spaceCode={code} />;
}