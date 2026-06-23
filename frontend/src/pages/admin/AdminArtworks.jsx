import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getArtworks, createArtwork, updateArtwork, deleteArtwork } from '../../services/artworkService';

const CATEGORIES = ['Oil Painting', 'Watercolor', 'Acrylic', 'Charcoal', 'Pastel', 'Mixed Media', 'Digital', 'Sketch', 'Other'];

const emptyForm = { title: '', description: '', category: 'Oil Painting', medium: '', year: '', tags: '', isFeatured: false, isPublished: true };

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getArtworks({ limit: 50 }).then((r) => setArtworks(r.data.artworks || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (a) => {
    setEditing(a._id);
    setForm({
      title: a.title || '', description: a.description || '', category: a.category || 'Oil Painting',
      medium: a.medium || '', year: a.year || '', tags: (a.tags || []).join(', '),
      isFeatured: a.isFeatured || false, isPublished: a.isPublished !== false,
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') fd.append('tags', JSON.stringify(v.split(',').map((t) => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (editing) { await updateArtwork(editing, fd); toast.success('Artwork updated'); }
      else { await createArtwork(fd); toast.success('Artwork created'); }
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this artwork?')) return;
    try { await deleteArtwork(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8]">Artworks</h1>
        <button onClick={openCreate} className="btn-gold text-xs">+ Add Artwork</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] rounded-[8px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6">{editing ? 'Edit Artwork' : 'Add Artwork'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Image {!editing && '*'}</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-[#cccccc] text-sm" required={!editing} />
              </div>
              <div>
                <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Title *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Category *</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Medium</label>
                  <input value={form.medium} onChange={(e) => setForm((p) => ({ ...p, medium: e.target.value }))} className="input-field" placeholder="e.g. Oil on canvas" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className="input-field" placeholder="2024" />
                </div>
                <div>
                  <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} className="input-field" placeholder="nature, portrait, abstract" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} /> Featured
                </label>
                <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} /> Published
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded" />)}</div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(201,168,76,0.1)]">
                <th className="text-left p-4 text-[#555555] font-medium">Artwork</th>
                <th className="text-left p-4 text-[#555555] font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">Featured</th>
                <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">Likes</th>
                <th className="text-right p-4 text-[#555555] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((a) => (
                <tr key={a._id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(201,168,76,0.03)]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={a.imageUrl} alt="" className="w-10 h-10 object-cover rounded-[4px]" />
                      <span className="text-[#cccccc]">{a.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#777777] hidden md:table-cell">{a.category}</td>
                  <td className="p-4 hidden lg:table-cell">
                    {a.isFeatured ? <span className="text-[#c9a84c] text-xs">★ Featured</span> : <span className="text-[#444444] text-xs">—</span>}
                  </td>
                  <td className="p-4 text-[#777777] hidden lg:table-cell">{a.likes?.length || 0}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(a)} className="text-[#c9a84c] hover:underline text-xs mr-4">Edit</button>
                    <button onClick={() => handleDelete(a._id)} className="text-[#b87c7c] hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {artworks.length === 0 && <p className="text-center text-[#555555] py-12">No artworks yet</p>}
        </div>
      )}
    </div>
  );
}
