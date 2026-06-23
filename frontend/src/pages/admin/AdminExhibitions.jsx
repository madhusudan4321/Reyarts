import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getExhibitions, createExhibition, updateExhibition, deleteExhibition } from '../../services/exhibitionService';

const emptyForm = { title: '', description: '', venue: '', location: '', startDate: '', endDate: '', isPast: false, isHighlighted: false };

export default function AdminExhibitions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getExhibitions({ isPast: false }), getExhibitions({ isPast: true })])
      .then(([u, p]) => setItems([...(u.data || []), ...(p.data || [])]))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFiles([]); setShowForm(true); };
  const openEdit = (e) => {
    setEditing(e._id);
    setForm({ title: e.title || '', description: e.description || '', venue: e.venue || '', location: e.location || '',
      startDate: e.startDate?.slice(0, 10) || '', endDate: e.endDate?.slice(0, 10) || '',
      isPast: e.isPast || false, isHighlighted: e.isHighlighted || false });
    setImageFiles([]); setShowForm(true);
  };

  const handleSave = async (ev) => {
    ev.preventDefault(); setSaving(true);
    try {
      if (editing) {
        await updateExhibition(editing, form);
        toast.success('Updated');
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        imageFiles.forEach((f) => fd.append('images', f));
        await createExhibition(fd);
        toast.success('Created');
      }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exhibition?')) return;
    try { await deleteExhibition(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8]">Exhibitions</h1>
        <button onClick={openCreate} className="btn-gold text-xs">+ Add Exhibition</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] rounded-[8px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6">{editing ? 'Edit Exhibition' : 'New Exhibition'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Title *" required />
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Description *" required />
              <div className="grid grid-cols-2 gap-4">
                <input value={form.venue} onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))} className="input-field" placeholder="Venue *" required />
                <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="input-field" placeholder="City, Country" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[#777777] text-xs mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="input-field" required /></div>
                <div><label className="block text-[#777777] text-xs mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="input-field" required /></div>
              </div>
              {!editing && (
                <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Images</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files))} className="text-[#cccccc] text-sm" /></div>
              )}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer"><input type="checkbox" checked={form.isPast} onChange={(e) => setForm((p) => ({ ...p, isPast: e.target.checked }))} /> Past Exhibition</label>
                <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer"><input type="checkbox" checked={form.isHighlighted} onChange={(e) => setForm((p) => ({ ...p, isHighlighted: e.target.checked }))} /> Highlighted</label>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}</div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[rgba(201,168,76,0.1)]">
              <th className="text-left p-4 text-[#555555] font-medium">Title</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden md:table-cell">Venue</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">Status</th>
              <th className="text-right p-4 text-[#555555] font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="p-4 text-[#cccccc]">{e.title}</td>
                  <td className="p-4 text-[#777777] hidden md:table-cell">{e.venue}</td>
                  <td className="p-4 hidden lg:table-cell"><span className={`text-xs ${e.isPast ? 'text-[#555555]' : 'text-[#c9a84c]'}`}>{e.isPast ? 'Past' : 'Upcoming'}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(e)} className="text-[#c9a84c] hover:underline text-xs mr-4">Edit</button>
                    <button onClick={() => handleDelete(e._id)} className="text-[#b87c7c] hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="text-center text-[#555555] py-12">No exhibitions yet</p>}
        </div>
      )}
    </div>
  );
}
