import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllComments, deleteComment } from '../../services/commentService';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getAllComments().then((r) => setComments(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try { await deleteComment(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">Comments ({comments.length})</h1>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[rgba(201,168,76,0.1)]">
              <th className="text-left p-4 text-[#555555] font-medium">Comment</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden md:table-cell">Author</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">On</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">Date</th>
              <th className="text-right p-4 text-[#555555] font-medium">Action</th>
            </tr></thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c._id} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="p-4 text-[#cccccc] max-w-xs truncate">{c.text}</td>
                  <td className="p-4 text-[#777777] hidden md:table-cell">{c.author?.name}</td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-xs text-[#777777]">{c.artwork ? `Artwork: ${c.artwork.title}` : c.blog ? `Blog: ${c.blog.title}` : '—'}</span>
                  </td>
                  <td className="p-4 text-[#555555] text-xs hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="text-[#b87c7c] hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {comments.length === 0 && <p className="text-center text-[#555555] py-12">No comments yet</p>}
        </div>
      )}
    </div>
  );
}
