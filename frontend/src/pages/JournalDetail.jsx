import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBlogById } from '../services/blogService';

export default function JournalDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogById(id)
      .then((res) => setBlog(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen pt-24 px-6 max-w-3xl mx-auto">
      <div className="skeleton h-64 w-full rounded mb-8" />
      <div className="space-y-4">
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#555555]">Blog post not found</p>
    </div>
  );

  const { title, excerpt, content, coverImage, category, tags = [], createdAt, readTime } = blog;

  return (
    <div className="page-enter pt-20 min-h-screen">
      {/* Cover */}
      {coverImage && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-badge">{category}</span>
            <span className="text-[#555555] text-xs">{readTime} min read</span>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl md:text-5xl text-[#f5f0e8] font-bold mb-4 leading-tight">
            {title}
          </h1>

          <div className="flex items-center gap-4 mb-6 text-[#777777] text-sm">
            <span>By Reya Saran</span>
            <span>·</span>
            <span>{new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <div className="gold-divider mb-8" />

          {excerpt && (
            <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl text-[#cccccc] italic leading-relaxed mb-8 border-l-2 border-[#c9a84c] pl-5">
              {excerpt}
            </p>
          )}

          {/* Blog content — rendered as HTML from rich text editor */}
          <div
            className="prose-content text-[#cccccc] leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: '1.8' }}
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[rgba(201,168,76,0.1)]">
              {tags.map((tag) => <span key={tag} className="tag-badge">{tag}</span>)}
            </div>
          )}

          <div className="mt-10">
            <Link to="/journal" className="btn-ghost text-xs">← Back to Journal</Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
