import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomeRedirect from './HomeRedirect';
import NavBar from './Navbar';
import AboutPage from './AboutPage'; 
import Login from './Signin';
import SpacesOverview from './SpacesOverview';
import SpaceRoom from './SpaceRoom';
import CreateAccount from './SignUp';
import Materials from './Materials';
import AccountSettings from './components/Profile/AccountSettings';
import { useUser } from './UserContext';
import { AnimatePresence } from "framer-motion";
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';


function AppInner() {
  const location = useLocation(); 

  useEffect(() => {
    fetch('https://api.memory-branch.com/api/csrf/', {
      credentials: 'include',
    }).catch(() => {
      console.warn('Could not get CSRF cookie');
    });
  }, []);

  return (
    <>
      <NavBar />
      <ScrollToTop/>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomeRedirect />
              </PageTransition>
            }
          />
          <Route
            path="/spaces"
            element={
              <PageTransition>
                <SpacesOverview />
              </PageTransition>
            }
          />
          <Route
            path="/sign-in"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PageTransition>
                <CreateAccount />
              </PageTransition>
            }
          />
          <Route
            path="/materials"
            element={
              <PageTransition>
                <Materials />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />
          <Route
            path="/account-settings"
            element={
              <PageTransition>
                <AccountSettings />
              </PageTransition>
            }
          />
          <Route
            path="/space/:id"
            element={
              <PageTransition>
                <SpaceRoom />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <main className="w-screen min-h-screen overflow-x-hidden bg-[#ece7e3] font-poppins">
        <AppInner />
      </main>
    </Router>
  );
}


