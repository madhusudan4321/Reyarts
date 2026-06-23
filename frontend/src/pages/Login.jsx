import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginService(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate(res.data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-8 h-8 border border-[#c9a84c] rotate-45 flex items-center justify-center">
              <span className="text-[#c9a84c] text-xs font-bold -rotate-45">R</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-semibold text-[#f5f0e8]">Reyarts</span>
          </Link>
          <p style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-[#777777] italic mt-3">Welcome back</p>
        </div>

        <div className="card-surface p-8">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#f5f0e8] mb-6 text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            <div>
              <label htmlFor="login-email" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Email</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-[#777777] text-xs uppercase tracking-widest mb-2">Password</label>
              <input
                id="login-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[#777777] text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#c9a84c] hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
