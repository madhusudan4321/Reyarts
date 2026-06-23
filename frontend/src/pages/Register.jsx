import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { register as registerService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await registerService({ name: form.name, email: form.email, password: form.password });
      login(res.data);
      toast.success('Welcome to Reyarts!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-8 h-8 border border-[#c9a84c] rotate-45 flex items-center justify-center">
              <span className="text-[#c9a84c] text-xs font-bold -rotate-45">R</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-semibold text-[#f5f0e8]">Reyarts</span>
          </Link>
          <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-[#777777] italic mt-3">Join the community</p>
        </div>

        <div className="card-surface p-8">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6 text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5" id="register-form">
            <div>
              <label htmlFor="reg-name" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Full Name</label>
              <input id="reg-name" type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Email</label>
              <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input-field" placeholder="your@email.com" required />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Password</label>
              <input id="reg-password" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="input-field" placeholder="Min 6 characters" required />
            </div>
            <div>
              <label htmlFor="reg-confirm" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Confirm Password</label>
              <input id="reg-confirm" type="password" value={form.confirm} onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))} className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-[#777777] text-sm mt-6">
            Already have an account? <Link to="/login" className="text-[#c9a84c] hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
