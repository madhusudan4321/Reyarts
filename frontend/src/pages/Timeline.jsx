import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTimeline } from '../services/timelineService';

const CATEGORY_COLORS = {
  'First Work': '#c9a84c',
  'Milestone': '#b87c7c',
  'Award': '#8c7cc9',
  'Exhibition': '#7cb8a8',
  'Learning': '#c9b87c',
  'Personal': '#c97c8c',
  'Other': '#888888',
};

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimeline()
      .then((res) => setEvents(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-16 text-center">
          <p className="section-label mb-4">A Creative Life</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl md:text-6xl text-[#f5f0e8] font-bold mb-4">
            Journey
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-[#999999] max-w-lg mx-auto">
            From the first stroke of paint to international exhibitions — the milestones of an artist's life.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-8 pb-24">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-8">
                <div className="skeleton w-16 h-6 rounded" />
                <div className="flex-1 skeleton h-24 rounded" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#555555]">No events yet</p>
          </div>
        ) : (
          <div className="relative pb-24">
            {/* Center line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#c9a84c] via-[rgba(201,168,76,0.3)] to-transparent" />

            <div className="space-y-12">
              {events.map((event, i) => {
                const isLeft = i % 2 === 0;
                const color = CATEGORY_COLORS[event.category] || '#888888';

                return (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ml-16 md:ml-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className={`card-surface p-6 ${isLeft ? 'md:ml-0' : ''}`}>
                        <div className="flex items-center gap-2 mb-2 flex-wrap" style={isLeft ? { justifyContent: 'flex-end' } : {}}>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-[#1a1a1a]" style={{ background: color }}>
                            {event.category}
                          </span>
                          <span className="text-[#c9a84c] text-sm font-semibold">{event.year}</span>
                        </div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#f5f0e8] text-lg font-semibold mb-2">
                          {event.title}
                        </h3>
                        <p className="text-[#999999] text-sm leading-relaxed">{event.description}</p>

                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="mt-4 w-full rounded-[4px] object-cover"
                            style={{ maxHeight: '200px' }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Dot */}
                    <div
                      className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 border-[#1a1a1a] -translate-x-1/2 mt-6"
                      style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
                    />

                    {/* Spacer for opposite side */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
