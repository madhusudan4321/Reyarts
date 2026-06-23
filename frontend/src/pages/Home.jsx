import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArtworks } from '../services/artworkService';
import { getBlogs } from '../services/blogService';
import ArtworkCard from '../components/artwork/ArtworkCard';
import BlogCard from '../components/blog/BlogCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Home() {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [latestArtworks, setLatestArtworks] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    getArtworks({ featured: true, limit: 6 }).then((res) => setFeaturedArtworks(res.data.artworks || [])).catch(() => {});
    getArtworks({ limit: 4, sort: 'newest' }).then((res) => setLatestArtworks(res.data.artworks || [])).catch(() => {});
    getBlogs({ limit: 3 }).then((res) => setLatestBlogs(res.data.blogs || [])).catch(() => {});
  }, []);

  return (
    <div className="page-enter">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(184,124,124,0.06) 0%, transparent 50%), linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 100%)',
          }}
        />

        {/* Decorative lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/3 right-0 w-px h-48 opacity-20"
            style={{ background: 'linear-gradient(to bottom, transparent, #c9a84c, transparent)' }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-px h-32 opacity-20"
            style={{ background: 'linear-gradient(to bottom, transparent, #c9a84c, transparent)' }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="section-label mb-6"
          >
            The Art Portfolio of
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-6xl md:text-8xl font-bold text-[#f5f0e8] leading-[1.05] mb-4"
          >
            Reya Saran
          </motion.h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="flex justify-center mb-6"
          >
            <div className="gold-divider mx-auto" style={{ width: '80px' }} />
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            className="text-xl md:text-2xl text-[#cccccc] italic leading-relaxed max-w-2xl mx-auto mb-12"
          >
            Where pigments meet poetry — a world of original paintings inspired by literature, emotion, and the quiet beauty of everyday life.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="flex items-center justify-center gap-4"
          >
            <Link to="/gallery" className="btn-gold">
              Explore Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/about" className="btn-ghost">
              About Reya
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[#555555] text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c] to-transparent opacity-60" />
        </motion.div>
      </section>

      {/* ── FEATURED ARTWORKS ── */}
      {featuredArtworks.length > 0 && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <p className="section-label mb-3">Selected Works</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#f5f0e8] font-semibold">
                Featured Artworks
              </h2>
            </div>
            <Link to="/gallery" className="btn-ghost self-start md:self-auto">
              View All
            </Link>
          </motion.div>

          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {featuredArtworks.map((artwork, i) => (
              <div key={artwork._id} className="break-inside-avoid">
                <ArtworkCard artwork={artwork} index={i} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LATEST WORKS ── */}
      {latestArtworks.length > 0 && (
        <section className="py-24 bg-[#141414]">
          <div className="px-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="section-label mb-3">Fresh From the Studio</p>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#f5f0e8] font-semibold">
                Latest Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {latestArtworks.map((artwork, i) => (
                <ArtworkCard key={artwork._id} artwork={artwork} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT PREVIEW ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-4">The Artist</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl md:text-5xl text-[#f5f0e8] font-semibold mb-6 leading-tight">
              Painting Emotions,<br />
              <em className="text-[#c9a84c]">Telling Stories</em>
            </h2>
            <div className="gold-divider mb-6" />
            <p className="text-[#999999] leading-relaxed mb-4">
              Reya Saran is a self-taught artist whose work lives at the intersection of visual art and literature. Raised on a diet of classic novels and vibrant pigments, she brings narrative depth to every canvas.
            </p>
            <p className="text-[#999999] leading-relaxed mb-8">
              Her paintings are windows into worlds both real and imagined — where the quiet drama of oil paint meets the emotional resonance of a well-told story.
            </p>
            <Link to="/about" className="btn-gold">
              Discover Her Story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-[rgba(201,168,76,0.2)] rounded-[4px]" />
            <div className="relative bg-[#222222] rounded-[4px] aspect-[4/5] flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"
                alt="Artist at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── JOURNAL PREVIEW ── */}
      {latestBlogs.length > 0 && (
        <section className="py-24 bg-[#141414]">
          <div className="px-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
            >
              <div>
                <p className="section-label mb-3">Words & Reflections</p>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#f5f0e8] font-semibold">
                  Artist Journal
                </h2>
              </div>
              <Link to="/journal" className="btn-ghost self-start md:self-auto">
                Read All
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestBlogs.map((blog, i) => (
                <BlogCard key={blog._id} blog={blog} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-3xl md:text-4xl text-[#cccccc] italic leading-relaxed mb-8">
            "Every painting is a voyage into a sacred wilderness."
          </p>
          <p className="text-[#555555] text-sm mb-8">— Eugene Delacroix</p>
          <Link to="/contact" className="btn-ghost">
            Get in Touch
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
