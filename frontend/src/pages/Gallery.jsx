import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { getArtworks } from '../services/artworkService';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { ArtworkCardSkeleton } from '../components/common/LoadingSkeleton';

const CATEGORIES = ['All', 'Oil Painting', 'Watercolor', 'Acrylic', 'Charcoal', 'Pastel', 'Mixed Media', 'Digital', 'Sketch', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

const breakpoints = { default: 4, 1280: 3, 1024: 3, 768: 2, 640: 2, 480: 1 };

export default function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  const fetchArtworks = useCallback(async (resetPage = false) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const params = { page: currentPage, limit: 12, sort };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const res = await getArtworks(params);
      const data = res.data;

      if (resetPage) {
        setArtworks(data.artworks || []);
        setPage(1);
      } else {
        setArtworks((prev) => (currentPage === 1 ? data.artworks : [...prev, ...data.artworks]));
      }
      setTotal(data.total || 0);
      setHasMore(currentPage < data.pages);
    } catch {
      /* silent */
    }
    setLoading(false);
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchArtworks(true);
  }, [search, category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
  };

  useEffect(() => {
    if (page > 1) fetchArtworks(false);
  }, [page]);

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-16 text-center"
        >
          <p className="section-label mb-4">Explore</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl md:text-6xl text-[#f5f0e8] font-bold mb-4">
            The Gallery
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-[#999999] max-w-lg mx-auto">
            A collection of original paintings — each one a story, a feeling, a moment captured in pigment and light.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="mb-10 space-y-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search artworks..."
              className="input-field flex-1"
              id="gallery-search"
            />
            <button type="submit" className="btn-gold px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-xs uppercase tracking-widest px-3 py-1.5 border transition-all duration-200 ${
                    category === cat
                      ? 'border-[#c9a84c] bg-[#c9a84c] text-[#1a1a1a]'
                      : 'border-[#333333] text-[#999999] hover:border-[#c9a84c] hover:text-[#c9a84c]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto ml-auto text-sm"
              id="gallery-sort"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-[#555555] text-sm">
              Showing {artworks.length} of {total} artworks
              {search && <span> matching "<em className="text-[#c9a84c]">{search}</em>"</span>}
            </p>
          )}
        </div>

        {/* Masonry Grid */}
        {loading && artworks.length === 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <ArtworkCardSkeleton />
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#555555] mb-3">No artworks found</p>
            <p className="text-[#444444]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpoints}
            className="flex gap-4"
            columnClassName="flex flex-col gap-4"
          >
            {artworks.map((artwork, i) => (
              <ArtworkCard key={artwork._id} artwork={artwork} index={i % 12} />
            ))}
          </Masonry>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-12 mb-12">
            <button onClick={loadMore} className="btn-ghost">
              Load More
            </button>
          </div>
        )}
        {loading && artworks.length > 0 && (
          <div className="flex justify-center mt-8 mb-12">
            <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
