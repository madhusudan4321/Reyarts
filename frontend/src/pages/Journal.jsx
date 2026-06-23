import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBlogs } from '../services/blogService';
import BlogCard from '../components/blog/BlogCard';
import { BlogCardSkeleton } from '../components/common/LoadingSkeleton';

const CATEGORIES = ['All', 'Painting Story', 'Creative Process', 'Book Inspiration', 'Personal Reflection', 'Exhibition Notes', 'Other'];

export default function Journal() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');

  const fetchBlogs = async (reset = false) => {
    setLoading(true);
    try {
      const p = reset ? 1 : page;
      const params = { page: p, limit: 9 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await getBlogs(params);
      const data = res.data;
      if (reset) { setBlogs(data.blogs || []); setPage(1); }
      else { setBlogs((prev) => p === 1 ? data.blogs : [...prev, ...data.blogs]); }
      setTotal(data.total || 0);
      setHasMore(p < data.pages);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(true); }, [search, category]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); };
  const loadMore = () => { const next = page + 1; setPage(next); };
  useEffect(() => { if (page > 1) fetchBlogs(false); }, [page]);

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-16 text-center">
          <p className="section-label mb-4">Words & Reflections</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl md:text-6xl text-[#f5f0e8] font-bold mb-4">
            Artist Journal
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-[#999999] max-w-lg mx-auto">
            Stories behind the paintings, books that moved me, and reflections on the creative life.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-8 space-y-5">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search journal..." className="input-field flex-1" id="journal-search" />
            <button type="submit" className="btn-gold px-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`text-xs uppercase tracking-widest px-3 py-1.5 border transition-all duration-200 ${category === cat ? 'border-[#c9a84c] bg-[#c9a84c] text-[#1a1a1a]' : 'border-[#333333] text-[#999999] hover:border-[#c9a84c] hover:text-[#c9a84c]'}`}>{cat}</button>
            ))}
          </div>
          {!loading && <p className="text-[#555555] text-sm">Showing {blogs.length} of {total} entries</p>}
        </div>

        {/* Grid */}
        {loading && blogs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#555555] mb-3">No entries found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)}
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-12 mb-12">
            <button onClick={loadMore} className="btn-ghost">Load More</button>
          </div>
        )}
        {loading && blogs.length > 0 && <div className="flex justify-center mt-8 mb-12"><div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" /></div>}
      </div>
    </div>
  );
}
