import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import ArtworkCard from '../components/artwork/ArtworkCard';
import toast from 'react-hot-toast';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then((res) => setFavorites(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (artworkId) => {
    try {
      await removeFavorite(artworkId);
      setFavorites((prev) => prev.filter((f) => f.artwork._id !== artworkId));
      toast.success('Removed from favorites');
    } catch { toast.error('Failed to remove'); }
  };

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-16">
          <p className="section-label mb-4">Your Collection</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#f5f0e8] font-bold mb-4">Saved Artworks</h1>
          <div className="gold-divider mb-8" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#555555] mb-4">No saved artworks yet</p>
            <Link to="/gallery" className="btn-gold">Explore Gallery</Link>
          </div>
        ) : (
          <>
            <p className="text-[#555555] text-sm mb-8">{favorites.length} saved artwork{favorites.length > 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24">
              {favorites.map((fav, i) => (
                <div key={fav._id} className="relative group">
                  <ArtworkCard artwork={fav.artwork} index={i} />
                  <button
                    onClick={() => handleRemove(fav.artwork._id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white/70 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    aria-label="Remove from favorites"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
