import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getArtworkById, toggleLike, getRelatedArtworks } from '../services/artworkService';
import { addFavorite, removeFavorite, checkFavorite } from '../services/favoriteService';
import { getComments, addComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import ArtworkCard from '../components/artwork/ArtworkCard';
import { DetailSkeleton } from '../components/common/LoadingSkeleton';

export default function ArtworkDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [artwork, setArtwork] = useState(null);
  const [related, setRelated] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getArtworkById(id);
        setArtwork(res.data);
        setLikeCount(res.data.likes?.length || 0);
        setLiked(isAuthenticated && res.data.likes?.includes(user?._id));

        getRelatedArtworks(id).then((r) => setRelated(r.data || [])).catch(() => {});
        getComments({ artworkId: id }).then((r) => setComments(r.data || [])).catch(() => {});

        if (isAuthenticated) {
          checkFavorite(id).then((r) => setFavorited(r.data.isFavorited)).catch(() => {});
        }
      } catch {
        /* not found */
      }
      setLoading(false);
    };
    load();
  }, [id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to like artworks'); return; }
    try {
      const res = await toggleLike(id);
      setLiked(res.data.isLiked);
      setLikeCount(res.data.likes);
    } catch { toast.error('Failed to update like'); }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to save favorites'); return; }
    try {
      if (favorited) {
        await removeFavorite(id);
        setFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await addFavorite(id);
        setFavorited(true);
        toast.success('Added to favorites');
      }
    } catch { toast.error('Failed to update favorites'); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await addComment({ text: newComment, artworkId: id });
      setComments((prev) => [res.data, ...prev]);
      setNewComment('');
      toast.success('Comment added');
    } catch { toast.error('Failed to add comment'); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch { toast.error('Failed to delete comment'); }
  };

  if (loading) return <DetailSkeleton />;
  if (!artwork) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-[#555555] text-lg">Artwork not found</p>
    </div>
  );

  const { title, description, imageUrl, category, medium, year, dimensions, tags = [] } = artwork;

  return (
    <div className="page-enter pt-20 min-h-screen">
      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fullscreen-viewer"
            onClick={() => setFullscreen(false)}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-h-screen max-w-screen object-contain p-4"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl"
              aria-label="Close fullscreen"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Artwork Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group cursor-zoom-in"
            onClick={() => setFullscreen(true)}
          >
            <div className="absolute -top-3 -left-3 w-full h-full border border-[rgba(201,168,76,0.15)] rounded-[4px]" />
            <img
              src={imageUrl}
              alt={title}
              className="w-full rounded-[4px] object-cover shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
            />
            <div className="absolute bottom-4 right-4 bg-black/70 text-white/70 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Click to expand
            </div>
          </motion.div>

          {/* Artwork Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="py-4"
          >
            <span className="tag-badge mb-4 inline-block">{category}</span>
            <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl md:text-5xl text-[#f5f0e8] font-bold mb-4 leading-tight">
              {title}
            </h1>
            <div className="gold-divider mb-6" />

            {/* Action buttons */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 border transition-all duration-200 text-sm ${
                  liked
                    ? 'border-[#c9a84c] bg-[rgba(201,168,76,0.1)] text-[#c9a84c]'
                    : 'border-[#333333] text-[#999999] hover:border-[#c9a84c] hover:text-[#c9a84c]'
                }`}
                id="like-artwork-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeCount}
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 border transition-all duration-200 text-sm ${
                  favorited
                    ? 'border-[#b87c7c] bg-[rgba(184,124,124,0.1)] text-[#b87c7c]'
                    : 'border-[#333333] text-[#999999] hover:border-[#b87c7c] hover:text-[#b87c7c]'
                }`}
                id="favorite-artwork-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3l14 9-14 9V3z" />
                </svg>
                {favorited ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-[#333333] text-[#999999] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200 text-sm"
                id="share-artwork-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Description */}
            <p className="text-[#cccccc] leading-relaxed mb-8">{description}</p>

            {/* Metadata */}
            <div className="space-y-3 border-t border-[rgba(201,168,76,0.1)] pt-6">
              {medium && <div className="flex gap-4 text-sm"><span className="text-[#555555] w-24">Medium</span><span className="text-[#cccccc]">{medium}</span></div>}
              {year && <div className="flex gap-4 text-sm"><span className="text-[#555555] w-24">Year</span><span className="text-[#cccccc]">{year}</span></div>}
              {dimensions?.width && (
                <div className="flex gap-4 text-sm">
                  <span className="text-[#555555] w-24">Dimensions</span>
                  <span className="text-[#cccccc]">{dimensions.width} × {dimensions.height} {dimensions.unit}</span>
                </div>
              )}
              <div className="flex gap-4 text-sm"><span className="text-[#555555] w-24">Category</span><span className="text-[#cccccc]">{category}</span></div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((tag) => <span key={tag} className="tag-badge">{tag}</span>)}
              </div>
            )}
          </motion.div>
        </div>

        {/* Comments Section */}
        <section className="mb-24 border-t border-[rgba(201,168,76,0.1)] pt-12">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-8">
            Reflections ({comments.length})
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8 flex gap-3">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this piece..."
                className="input-field"
                id="comment-input"
                maxLength={500}
              />
              <button type="submit" className="btn-gold whitespace-nowrap">Post</button>
            </form>
          ) : (
            <p className="text-[#555555] text-sm mb-8">
              <Link to="/login" className="text-[#c9a84c] hover:underline">Sign in</Link> to share your thoughts.
            </p>
          )}

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="card-surface p-4 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-[#c9a84c] text-sm font-semibold shrink-0">
                  {comment.author?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#f5f0e8] text-sm font-medium">{comment.author?.name}</span>
                    <span className="text-[#555555] text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[#999999] text-sm">{comment.text}</p>
                </div>
                {(user?._id === comment.author?._id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-[#555555] hover:text-[#b87c7c] transition-colors text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Artworks */}
        {related.length > 0 && (
          <section className="border-t border-[rgba(201,168,76,0.1)] pt-12 mb-12">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-8">
              Related Works
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((a, i) => <ArtworkCard key={a._id} artwork={a} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
