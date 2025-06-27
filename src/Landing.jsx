import { delay, motion } from 'framer-motion';
import { IoCameraOutline } from "react-icons/io5";
import { useRef, useState ,useEffect } from 'react';
import { useNavigate, useLocation, Link} from 'react-router-dom';
import { Divider } from '@mui/material';
import CustomDivider from './components/CustomDivider';

function HeroText({ title, body }) {
  return (
    <div className="w-full px-6 flex flex-col justify-center items-center text-primary gap-4">
      <h1 className="text-3xl">{title}</h1>
      <p className="text-lg text-center">{body}</p>
    </div>
  );
}

export default function Landing() {
  const [spaceCode, setSpaceCode] = useState('');
  const [error, setError] = useState('');
  const navigate   = useNavigate();
  const location   = useLocation();
  const fileRef    = useRef(null);


  const getCsrfTokenFromCookie = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  const lookupSpace = async (code) => {
    try {
      const response = await fetch(
        `https://softsteve.pythonanywhere.com/api/space-lookup/?code=${code}`,
        {
          credentials: 'include',
          headers: { 'X-CSRFToken': getCsrfTokenFromCookie() },
        }
      );

      if (response.status === 401 || response.status === 403) {
        navigate('/sign-in', { state: { spaceCode: code } });
        return;
      }

      const data = await response.json();

      if (response.ok && data.event_id) {
        navigate(`/space/${data.event_id}`);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to server');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    lookupSpace(spaceCode);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code   = params.get('spaceCode');
    if (!code) return;

    setSpaceCode(code);  
    setError('');
    lookupSpace(code);        
  }, [location.search]); 

  return (
    <div className="w-screen overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="w-full min-h-screen relative">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/background-img.png')" }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-primary">
          <div className="max-w-2xl text-center space-y-4">
            <h1 className="font-semibold
              text-[clamp(1.75rem,5vw,3rem)]   /* scales smoothly 28-48px */
            ">
              Share Your Memories
            </h1>
            <p className="
              text-[clamp(1rem,2.5vw,1.25rem)] /* 16-20px */
            ">
              A place to collect, share, and revisit your memories together—anytime, anywhere.
            </p>
          </div>
            <form onSubmit={handleSubmit} className="mt-16 w-full max-w-md flex flex-col items-center gap-4">
              <div className='relative w-full max-w-md'>
                <input
                type='text'
                value={spaceCode}
                onChange={(e) => setSpaceCode(e.target.value)}
                required
                placeholder="Space Code"
                className="w-full px-4 py-3 border border-border bg-primary/20 text-white placeholder-white placeholder:italic rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-full p-3 text-xl text-white rounded-lg bg-primary/20 border border-border shadow-xl"
                type="submit"
              >
                Find Space
              </motion.button>
            </form>
  
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-background text-primary py-20 px-6 text-center">
        <h2 className="text-2xl mb-8 font-bold">How It Works</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { title: 'Create or Join', desc: 'Enter a code or generate your own space.' },
            { title: 'Upload & Share', desc: 'Add photos, stories, or videos with others.' },
            { title: 'Revisit Anytime', desc: 'All memories are saved and synced.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              transition={{ delay: i * 0.2 }}
              className="bg-primary/5 rounded-xl p-6 border border-border shadow-md"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECOND CTA */}
      <section className="bg-primary/90 text-white py-20 px-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to Start?</h2>
        <p className="text-md mb-10">Jump into an event space or create a new one now.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to={'/sign-in'} className="px-6 py-3 bg-white text-primary rounded-lg font-semibold">Join a Space</Link>
          <Link to={'/sign-in'} className="px-6 py-3 border border-white rounded-lg font-semibold">Create New Space</Link>
        </div>
      </section>
    </div>
  );
}
