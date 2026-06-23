import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../../services/blogService';

const CATEGORIES = ['Painting Story', 'Creative Process', 'Book Inspiration', 'Personal Reflection', 'Exhibition Notes', 'Other'];
const emptyForm = { title: '', excerpt: '', content: '', category: 'Personal Reflection', tags: '', isFeatured: false, isPublished: true, readTime: 5 };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getBlogs({ limit: 50 }).then((r) => setBlogs(r.data.blogs || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (b) => {
    setEditing(b._id);
    setForm({ title: b.title || '', excerpt: b.excerpt || '', content: b.content || '', category: b.category || 'Personal Reflection', tags: (b.tags || []).join(', '), isFeatured: b.isFeatured || false, isPublished: b.isPublished !== false, readTime: b.readTime || 5 });
    setImageFile(null); setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') fd.append('tags', JSON.stringify(v.split(',').map((t) => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (imageFile) fd.append('coverImage', imageFile);
      if (editing) { await updateBlog(editing, fd); toast.success('Blog updated'); }
      else { await createBlog(fd); toast.success('Blog created'); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;
    try { await deleteBlog(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8]">Blog / Journal</h1>
        <button onClick={openCreate} className="btn-gold text-xs">+ New Post</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] rounded-[8px] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6">{editing ? 'Edit Post' : 'New Post'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Cover Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-[#cccccc] text-sm" /></div>
              <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Title *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" required /></div>
              <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} className="input-field resize-none" rows={2} /></div>
              <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Content *</label>
                <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} className="input-field resize-none" rows={8} required placeholder="Write your journal entry (HTML supported)..." /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Tags</label>
                  <input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} className="input-field" placeholder="tag1, tag2" /></div>
                <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Read Time (min)</label>
                  <input type="number" value={form.readTime} onChange={(e) => setForm((p) => ({ ...p, readTime: e.target.value }))} className="input-field" /></div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} /> Featured</label>
                <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} /> Published</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}</div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[rgba(201,168,76,0.1)]">
              <th className="text-left p-4 text-[#555555] font-medium">Title</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden md:table-cell">Category</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">Status</th>
              <th className="text-right p-4 text-[#555555] font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b._id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(201,168,76,0.03)]">
                  <td className="p-4 text-[#cccccc]">{b.title}</td>
                  <td className="p-4 text-[#777777] hidden md:table-cell">{b.category}</td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className={`text-xs ${b.isPublished ? 'text-green-400' : 'text-[#555555]'}`}>{b.isPublished ? 'Published' : 'Draft'}</span>
                    {b.isFeatured && <span className="ml-2 text-[#c9a84c] text-xs">★</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(b)} className="text-[#c9a84c] hover:underline text-xs mr-4">Edit</button>
                    <button onClick={() => handleDelete(b._id)} className="text-[#b87c7c] hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogs.length === 0 && <p className="text-center text-[#555555] py-12">No blog posts yet</p>}
        </div>
      )}
    </div>
  );
}
