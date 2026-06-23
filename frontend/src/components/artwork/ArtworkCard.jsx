import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ArtworkCard({ artwork, index = 0 }) {
  const { _id, title, imageUrl, category, likes = [], views = 0 } = artwork;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link to={`/gallery/${_id}`} className="artwork-card block rounded-[4px] overflow-hidden bg-[#222222]">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80';
          }}
        />

        {/* Hover overlay */}
        <div className="artwork-overlay">
          <div>
            <span className="section-label text-[0.65rem] mb-1 block">{category}</span>
            <h3
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-[#f5f0e8] text-base font-medium leading-tight"
            >
              {title}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-[#999999] text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likes.length}
              </span>
              <span className="flex items-center gap-1 text-[#999999] text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {views}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
