import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const navItems = [
  { label: 'Overview', to: '/admin', icon: '◈' },
  { label: 'Artworks', to: '/admin/artworks', icon: '◻' },
  { label: 'Blog', to: '/admin/blogs', icon: '◈' },
  { label: 'Exhibitions', to: '/admin/exhibitions', icon: '◎' },
  { label: 'Timeline', to: '/admin/timeline', icon: '◉' },
  { label: 'Comments', to: '/admin/comments', icon: '◷' },
];

function StatCard({ label, value, icon }) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="section-label">{label}</span>
        <span className="text-2xl opacity-40">{icon}</span>
      </div>
      <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#c9a84c] font-bold">{value}</p>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#f5f0e8] mb-8">Dashboard Overview</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-[8px]" />)}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <StatCard label="Artworks" value={stats.stats.totalArtworks} icon="◻" />
            <StatCard label="Blogs" value={stats.stats.totalBlogs} icon="◈" />
            <StatCard label="Users" value={stats.stats.totalUsers} icon="◎" />
            <StatCard label="Likes" value={stats.stats.totalLikes} icon="♡" />
            <StatCard label="Comments" value={stats.stats.totalComments} icon="◷" />
            <StatCard label="Exhibitions" value={stats.stats.totalExhibitions} icon="◉" />
          </div>

          {stats.mostViewedArtwork && (
            <div className="card-surface p-6 mb-6">
              <h3 className="section-label mb-4">Most Viewed Artwork</h3>
              <div className="flex gap-4 items-center">
                <img src={stats.mostViewedArtwork.imageUrl} alt="" className="w-16 h-16 object-cover rounded-[4px]" />
                <div>
                  <p className="text-[#f5f0e8] font-medium">{stats.mostViewedArtwork.title}</p>
                  <p className="text-[#777777] text-sm">{stats.mostViewedArtwork.views} views</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-surface p-6">
              <h3 className="section-label mb-4">Recent Artworks</h3>
              <ul className="space-y-3">
                {stats.recentArtworks?.map((a) => (
                  <li key={a._id} className="flex items-center gap-3">
                    <img src={a.imageUrl} alt="" className="w-10 h-10 object-cover rounded-[4px]" />
                    <div>
                      <p className="text-[#cccccc] text-sm">{a.title}</p>
                      <p className="text-[#555555] text-xs">{a.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-surface p-6">
              <h3 className="section-label mb-4">Recent Users</h3>
              <ul className="space-y-3">
                {stats.recentUsers?.map((u) => (
                  <li key={u._id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center text-[#c9a84c] text-sm font-semibold">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[#cccccc] text-sm">{u.name}</p>
                      <p className="text-[#555555] text-xs">{u.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <p className="text-[#555555]">Failed to load analytics.</p>
      )}
    </div>
  );
}

export function AdminLayout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0d0d0d] border-r border-[rgba(201,168,76,0.1)] flex flex-col py-6 px-4 fixed left-0 top-0 bottom-0 z-40">
        <Link to="/" className="flex items-center gap-2 mb-10 px-2">
          <div className="w-6 h-6 border border-[#c9a84c] rotate-45 flex items-center justify-center">
            <span className="text-[#c9a84c] text-[10px] font-bold -rotate-45">R</span>
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-[#f5f0e8] text-base">Reyarts</span>
        </Link>

        <p className="section-label px-2 mb-3">Admin</p>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ label, to, icon }) => {
            const active = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 ${
                  active
                    ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border-r-2 border-[#c9a84c] -mr-4 pr-4'
                    : 'text-[#777777] hover:text-[#cccccc]'
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => { logout(); navigate('/'); }}
          className="text-[#555555] hover:text-[#b87c7c] text-sm px-3 py-2 text-left transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8 min-h-screen bg-[#141414]">
        {children}
      </main>
    </div>
  );
}
