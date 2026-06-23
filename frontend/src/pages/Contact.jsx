import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data.message || 'Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="page-enter pt-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-16 text-center">
          <p className="section-label mb-4">Reach Out</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl md:text-6xl text-[#f5f0e8] font-bold mb-4">Contact</h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-[#999999] max-w-lg mx-auto">For inquiries, collaborations, or just to share thoughts on art and books.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pb-24">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-5"
            id="contact-form"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Name</label>
                <input id="contact-name" name="name" type="text" value={form.name} onChange={handleChange} className="input-field" placeholder="Your name" required />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Email</label>
                <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Subject</label>
              <input id="contact-subject" name="subject" type="text" value={form.subject} onChange={handleChange} className="input-field" placeholder="What's this about?" required />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Message</label>
              <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} className="input-field resize-none" rows={6} placeholder="Tell me..." required />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8 pt-6"
          >
            <div>
              <h3 className="section-label mb-3">Email</h3>
              <a href="mailto:reya@reyarts.com" className="text-[#c9a84c] hover:underline">reya@reyarts.com</a>
            </div>
            <div>
              <h3 className="section-label mb-3">Response Time</h3>
              <p className="text-[#999999] text-sm">Usually within 2–3 business days.</p>
            </div>
            <div>
              <h3 className="section-label mb-4">Social</h3>
              <div className="flex gap-3">
                {['Instagram', 'Pinterest', 'Behance'].map((s) => (
                  <a key={s} href="#" className="text-xs uppercase tracking-widest text-[#999999] hover:text-[#c9a84c] transition-colors border border-[#333333] hover:border-[#c9a84c] px-3 py-1.5">
                    {s}
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-[rgba(201,168,76,0.1)]">
              <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-[#777777] italic text-lg leading-relaxed">
                "Every conversation is a painting waiting to happen."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
