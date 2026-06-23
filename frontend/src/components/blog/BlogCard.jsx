import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogCard({ blog, index = 0 }) {
  const { _id, title, excerpt, coverImage, category, readTime, createdAt, tags = [] } = blog;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/journal/${_id}`} className="card-surface block overflow-hidden group">
        {/* Cover Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1456086272160-b28b0645b729?w=800&q=80';
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#222222] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#333333]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="tag-badge">{category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3 text-[#777777] text-xs">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>

          <h3
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-[#f5f0e8] text-lg font-semibold leading-snug mb-3 group-hover:text-[#c9a84c] transition-colors duration-300"
          >
            {title}
          </h3>

          {excerpt && (
            <p className="text-[#999999] text-sm leading-relaxed line-clamp-2 mb-4">
              {excerpt}
            </p>
          )}

          <div className="flex items-center gap-1 text-[#c9a84c] text-xs font-medium uppercase tracking-widest">
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
