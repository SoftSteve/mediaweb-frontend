import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PreviewJoin from './components/PreviewJoin';

export default function JoinRoute() {
  const { code } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://api.memory-branch.com/api/space-lookup/?code=${encodeURIComponent(code)}`,
          { credentials: 'include' }
        );
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.event_id) {
          setSpaceData({ ...data, code });
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      }
    })();
  }, [code]);

  if (notFound) return <>Not found.</>;
  if (!spaceData) return <>Loading...</>;

  return <PreviewJoin space={spaceData} />;
}