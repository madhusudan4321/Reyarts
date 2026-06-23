import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label mb-4">Lost?</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-8xl md:text-[10rem] font-bold text-[#222222] mb-4 leading-none">
          404
        </h1>
        <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-4">
          Page Not Found
        </h2>
        <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl text-[#777777] italic mb-10 max-w-sm mx-auto">
          Like a painting left unfinished, this page doesn't exist — but the gallery awaits.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-gold">Return Home</Link>
          <Link to="/gallery" className="btn-ghost">View Gallery</Link>
        </div>
      </motion.div>
    </div>
  );
}
