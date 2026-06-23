import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getTimeline, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent } from '../../services/timelineService';

const CATEGORIES = ['First Work', 'Milestone', 'Award', 'Exhibition', 'Learning', 'Personal', 'Other'];
const emptyForm = { title: '', description: '', date: '', category: 'Milestone', isHighlighted: false };

export default function AdminTimeline() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => { setLoading(true); getTimeline().then((r) => setEvents(r.data || [])).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowForm(true); };
  const openEdit = (e) => {
    setEditing(e._id);
    setForm({ title: e.title || '', description: e.description || '', date: e.date?.slice(0, 10) || '', category: e.category || 'Milestone', isHighlighted: e.isHighlighted || false });
    setImageFile(null); setShowForm(true);
  };

  const handleSave = async (ev) => {
    ev.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing) { await updateTimelineEvent(editing, fd); toast.success('Updated'); }
      else { await createTimelineEvent(fd); toast.success('Created'); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete event?')) return;
    try { await deleteTimelineEvent(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8]">Timeline</h1>
        <button onClick={openCreate} className="btn-gold text-xs">+ Add Event</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#1a1a1a] border border-[rgba(201,168,76,0.2)] rounded-[8px] w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6">{editing ? 'Edit Event' : 'New Event'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Event title *" required />
              <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Description *" required />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[#777777] text-xs mb-1">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="input-field" required /></div>
                <div><label className="block text-[#777777] text-xs mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="input-field">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div><label className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-[#cccccc] text-sm" /></div>
              <label className="flex items-center gap-2 text-[#cccccc] text-sm cursor-pointer"><input type="checkbox" checked={form.isHighlighted} onChange={(e) => setForm((p) => ({ ...p, isHighlighted: e.target.checked }))} /> Highlighted</label>
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
              <th className="text-left p-4 text-[#555555] font-medium">Event</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden md:table-cell">Category</th>
              <th className="text-left p-4 text-[#555555] font-medium hidden lg:table-cell">Year</th>
              <th className="text-right p-4 text-[#555555] font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="p-4 text-[#cccccc]">{e.title}</td>
                  <td className="p-4 text-[#777777] hidden md:table-cell">{e.category}</td>
                  <td className="p-4 text-[#c9a84c] text-sm hidden lg:table-cell">{e.year}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(e)} className="text-[#c9a84c] hover:underline text-xs mr-4">Edit</button>
                    <button onClick={() => handleDelete(e._id)} className="text-[#b87c7c] hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && <p className="text-center text-[#555555] py-12">No timeline events yet</p>}
        </div>
      )}
    </div>
  );
}
