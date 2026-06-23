import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getArtworks, createArtwork, updateArtwork, deleteArtwork } from '../../services/artworkService';

const CATEGORIES = ['Oil Painting', 'Watercolor', 'Acrylic', 'Charcoal', 'Pastel', 'Mixed Media', 'Digital', 'Sketch', 'Other'];

const emptyForm = { title: '', description: '', category: 'Oil Painting', medium: '', year: '', tags: '', isFeatured: false, isPublished: true };

// ── Image Drop Zone ────────────────────────────────────────────────────────────
function ImageDropZone({ imageFile, setImageFile, existingUrl }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(existingUrl || null);
  const inputRef = useRef();

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!imageFile && existingUrl) {
      setPreview(existingUrl);
    }
  }, [imageFile, existingUrl]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    setImageFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">
        Image {!existingUrl && '*'}
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        className="relative cursor-pointer rounded-[8px] border-2 border-dashed transition-all duration-300 overflow-hidden"
        style={{
          borderColor: dragging ? '#c9a84c' : 'rgba(201,168,76,0.25)',
          background: dragging ? 'rgba(201,168,76,0.05)' : 'rgba(255,255,255,0.02)',
          minHeight: preview ? 'auto' : '180px',
        }}
      >
        {preview ? (
          // Image preview
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-[320px] object-cover rounded-[6px]"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-[6px]">
              <div className="text-center">
                <svg className="w-8 h-8 text-[#c9a84c] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[#c9a84c] text-sm font-medium">Click to change image</p>
                <p className="text-[#777777] text-xs mt-1">or drag & drop a new one</p>
              </div>
            </div>
            {/* File name badge */}
            {imageFile && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded px-2 py-1 flex items-center gap-2">
                <svg className="w-3 h-3 text-[#c9a84c] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-[#cccccc] text-xs truncate">{imageFile.name}</span>
                <span className="text-[#555555] text-xs flex-shrink-0">({(imageFile.size / 1024 / 1024).toFixed(1)} MB)</span>
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center h-[180px] gap-3 px-6">
            <div className="w-14 h-14 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[#cccccc] text-sm">
                <span className="text-[#c9a84c]">Click to upload</span> or drag & drop
              </p>
              <p className="text-[#555555] text-xs mt-1">JPG, PNG, WEBP — high resolution recommended</p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getArtworks({ limit: 50 }).then((r) => setArtworks(r.data.artworks || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setEditingArtwork(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (a) => {
    setEditing(a._id);
    setEditingArtwork(a);
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
    if (!editing && !imageFile) { toast.error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') fd.append('tags', JSON.stringify(v.split(',').map((t) => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (editing) { await updateArtwork(editing, fd); toast.success('Artwork updated'); }
      else { await createArtwork(fd); toast.success('Artwork added to gallery'); }
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] rounded-[8px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
          >
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6">
              {editing ? 'Edit Artwork' : 'Add Artwork'}
            </h2>
            <form onSubmit={handleSave} className="space-y-5">

              {/* 🖼️ Image Upload */}
              <ImageDropZone
                imageFile={imageFile}
                setImageFile={setImageFile}
                existingUrl={editingArtwork?.imageUrl}
              />

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
                <button type="submit" disabled={saving} className="btn-gold">
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Uploading...
                    </span>
                  ) : 'Save'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Artwork Grid / Table */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-square rounded-[8px]" />)}
        </div>
      ) : artworks.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-[#555555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-[#555555] text-sm">No artworks yet. Click <strong className="text-[#c9a84c]">+ Add Artwork</strong> to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artworks.map((a) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-[8px] overflow-hidden bg-[#1a1a1a] border border-[rgba(255,255,255,0.05)]"
            >
              <div className="aspect-square overflow-hidden">
                <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-[#f5f0e8] text-sm font-medium truncate">{a.title}</p>
                <p className="text-[#777777] text-xs mb-3">{a.category} {a.year ? `· ${a.year}` : ''}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(a)} className="flex-1 text-center text-xs py-1 rounded border border-[rgba(201,168,76,0.4)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.1)] transition-colors">Edit</button>
                  <button onClick={() => handleDelete(a._id)} className="flex-1 text-center text-xs py-1 rounded border border-[rgba(184,124,124,0.4)] text-[#b87c7c] hover:bg-[rgba(184,124,124,0.1)] transition-colors">Delete</button>
                </div>
              </div>
              {a.isFeatured && (
                <div className="absolute top-2 right-2 bg-black/70 rounded px-2 py-0.5 text-[#c9a84c] text-xs">★ Featured</div>
              )}
              {!a.isPublished && (
                <div className="absolute top-2 left-2 bg-black/70 rounded px-2 py-0.5 text-[#777777] text-xs">Hidden</div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
