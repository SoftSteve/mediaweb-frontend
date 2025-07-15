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
import { AnimatePresence } from "framer-motion";
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import { useEffect, useState } from 'react';
import JoinRoute from './JoinRoute';


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
          <Route path="/join/:code" 
          element={
            <PageTransition>
              <JoinRoute/>
            </PageTransition>
            
          } 
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

   if (!isMobile) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#222] text-white text-center p-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Mobile Device Required</h1>
          <p className="text-lg">
            This app is designed for mobile. Please access it on a phone or resize your browser to a mobile width.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <main className="w-screen min-h-screen overflow-x-hidden bg-[#ece7e3] font-poppins">
        <AppInner />
      </main>
    </Router>
  );
}


