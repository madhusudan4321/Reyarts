import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getExhibitions } from '../services/exhibitionService';

function ExhibitionCard({ exhibition, index }) {
  const { title, description, venue, location, startDate, endDate, images = [], isPast } = exhibition;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-surface overflow-hidden group"
    >
      {images[0] && (
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 ${isPast ? 'bg-[#333333] text-[#999999]' : 'bg-[#c9a84c] text-[#1a1a1a]'}`}>
            {isPast ? 'Past' : 'Upcoming'}
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {!images[0] && (
            <span className={`tag-badge ${!isPast ? 'bg-[rgba(201,168,76,0.2)] border-[rgba(201,168,76,0.4)] text-[#c9a84c]' : ''}`}>
              {isPast ? 'Past Exhibition' : 'Upcoming'}
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#f5f0e8] text-xl font-semibold mb-2">{title}</h3>
        <p className="text-[#777777] text-sm mb-1">{venue}{location ? `, ${location}` : ''}</p>
        <p className="text-[#c9a84c] text-xs mb-4">{formatDate(startDate)} — {formatDate(endDate)}</p>
        <p className="text-[#999999] text-sm leading-relaxed line-clamp-3">{description}</p>
      </div>
    </motion.div>
  );
}

export default function Exhibitions() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getExhibitions({ isPast: false }),
      getExhibitions({ isPast: true }),
    ]).then(([u, p]) => {
      setUpcoming(u.data || []);
      setPast(p.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-16 text-center">
          <p className="section-label mb-4">Exhibitions</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl md:text-6xl text-[#f5f0e8] font-bold mb-4">
            Shows & Events
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-[#999999] max-w-lg mx-auto">
            Where the studio meets the world — past exhibitions and upcoming shows.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-[8px]" />)}
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="mb-16">
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-8 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#c9a84c] inline-block" />
                  Upcoming Exhibitions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((e, i) => <ExhibitionCard key={e._id} exhibition={e} index={i} />)}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section className="mb-24">
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-8 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#555555] inline-block" />
                  Past Exhibitions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map((e, i) => <ExhibitionCard key={e._id} exhibition={e} index={i} />)}
                </div>
              </section>
            )}

            {upcoming.length === 0 && past.length === 0 && (
              <div className="text-center py-24">
                <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#555555]">No exhibitions yet</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
