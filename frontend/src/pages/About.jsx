import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Section = ({ children, className = '' }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function About() {
  const achievements = [
    { year: '2024', title: 'Annual Art Showcase', desc: 'Featured artist at the City Cultural Center annual exhibition.' },
    { year: '2023', title: 'Best Emerging Artist', desc: 'Awarded at the Regional Fine Arts Fair.' },
    { year: '2022', title: 'Solo Exhibition "Chapters"', desc: 'First solo show inspired entirely by literary classics.' },
    { year: '2021', title: 'Art Residency', desc: 'Completed a 3-month residency at the Creative Arts Foundation.' },
  ];

  const influences = [
    { type: 'Artistic', items: ['J.M.W. Turner', 'Gustav Klimt', 'Winslow Homer', 'Georgia O\'Keeffe', 'Berthe Morisot'] },
    { type: 'Literary', items: ['Jane Austen', 'Fyodor Dostoevsky', 'Gabriel García Márquez', 'Sylvia Plath', 'Rumi'] },
  ];

  const funFacts = [
    'Paints to classical music or complete silence — nothing in between.',
    'Has read over 300 novels and keeps a handwritten reading journal since age 14.',
    'Starts every painting with a written description of the emotion she wants to capture.',
    'Collects vintage paintbrushes and antique ink pens.',
    'Believes every novel she reads eventually becomes a painting.',
  ];

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20 text-center"
        >
          <p className="section-label mb-4">The Artist</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-6xl md:text-7xl text-[#f5f0e8] font-bold mb-6">
            Reya Saran
          </h1>
          <div className="gold-divider mx-auto mb-6" style={{ width: '80px' }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-2xl text-[#cccccc] italic max-w-2xl mx-auto">
            --Painting Stories, Reading Worlds--
          </p>
        </motion.div>

        {/* Introduction */}
        <Section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div>
            <p className="section-label mb-4">Introduction</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-6">
              Hello, I'm Reya
            </h2>
            <div className="space-y-4 text-[#999999] leading-relaxed">
              <p>
                I'm an Artist living at the crossroads of visual art and literature. My canvases are shaped by the stories I've read, the emotions I've felt, and the quiet moments I've observed.
              </p>
              <p>
                I work primarily in oils and watercolors, drawn to their unique ability to capture both the precision of a thought and the fluidity of a feeling. Each painting begins not with a sketch, but with a sentence — a feeling I want to translate into color.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-full h-full border border-[rgba(201,168,76,0.15)] rounded-[4px]" />
            <img
              src="https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500&q=80"
              alt="Reya Saran"
              className="w-full rounded-[4px] object-cover"
              style={{ aspectRatio: '4/5' }}
            />
          </div>
        </Section>

        {/* Artistic Journey */}
        <Section className="mb-24">
          <p className="section-label mb-4">Origins</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">
            The Artistic Journey
          </h2>
          <div className="space-y-4 text-[#999999] leading-relaxed border-l-2 border-[rgba(201,168,76,0.3)] pl-8">
            <p>
              My relationship with art began at the age of seven, when I accidentally spilled watercolors over a library book I was reading. Instead of frustration, I felt wonder — the colors bloomed across the page in a way that felt more alive than the printed words beneath.
            </p>
            <p>
              For years, painting was a private language. I filled sketchbooks in secret, mixing colors in makeshift palettes, trying to paint the feelings I found in novels. By sixteen, I had my first oil set and a small attic room that smelled of linseed oil and old paper.
            </p>
            <p>
              Today, that same wonder drives every piece I create. The medium has evolved, but the impulse remains: to make visible what is felt but rarely seen.
            </p>
          </div>
        </Section>

        {/* Inspirations */}
        <Section className="mb-24">
          <p className="section-label mb-4">Influences</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">
            Inspirations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {influences.map(({ type, items }) => (
              <div key={type} className="card-surface p-6">
                <h3 className="section-label mb-4">{type} Influences</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[#cccccc]">
                      <div className="w-1 h-1 bg-[#c9a84c] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Philosophy */}
        <Section className="mb-24 bg-[#141414] -mx-6 lg:-mx-10 px-6 lg:px-10 py-16">
          <p className="section-label mb-4">Beliefs</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">
            Artistic Philosophy
          </h2>
          <div style={{ fontFamily: 'Cormorant Garamond, serif' }} className="space-y-6 text-xl text-[#cccccc] italic leading-relaxed">
            <p>
              "I don't paint what I see. I paint what a story made me feel. Every canvas is a translation — from the language of literature into the language of light and color."
            </p>
            <p>
              "Art should make you slow down. In a world of constant movement, a painting is an invitation to be still, to look, and to feel something real."
            </p>
            <p>
              "I believe the best art is honest art — it doesn't explain itself, it simply exists, and it asks you to bring your own truth to it."
            </p>
          </div>
        </Section>

        {/* Achievements */}
        <Section className="mb-24">
          <p className="section-label mb-4">Recognition</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">
            Achievements
          </h2>
          <div className="space-y-6">
            {achievements.map(({ year, title, desc }) => (
              <div key={year + title} className="flex gap-6 card-surface p-5">
                <div className="text-[#c9a84c] font-semibold text-sm w-12 shrink-0 pt-1">{year}</div>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#f5f0e8] text-lg mb-1">{title}</h3>
                  <p className="text-[#999999] text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Fun Facts */}
        <Section className="mb-24">
          <p className="section-label mb-4">Personal</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">
            Fun Facts
          </h2>
          <ul className="space-y-4">
            {funFacts.map((fact, i) => (
              <li key={i} className="flex gap-4 text-[#cccccc]">
                <span className="text-[#c9a84c] font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <p className="leading-relaxed">{fact}</p>
              </li>
            ))}
          </ul>
        </Section>

      </div>
    </div>
  );
}
