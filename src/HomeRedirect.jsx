import { Navigate } from 'react-router-dom';
import { useUser }  from './UserContext';
import Landing from './Landing';

export default function HomeRedirect() {
  const { user } = useUser();

  // already signed in → jump to /spaces
  if (user) return <Navigate to="/spaces" replace />;

  // not signed in → show the public landing page
  return <Landing />;
}
