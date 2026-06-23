import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import ArtworkDetail from './pages/ArtworkDetail';
import About from './pages/About';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import Timeline from './pages/Timeline';
import Exhibitions from './pages/Exhibitions';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import { AdminLayout } from './pages/admin/AdminOverview';
import AdminOverview from './pages/admin/AdminOverview';
import AdminArtworks from './pages/admin/AdminArtworks';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminExhibitions from './pages/admin/AdminExhibitions';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminComments from './pages/admin/AdminComments';

const adminRoutes = [
  { path: '/admin', element: <AdminOverview /> },
  { path: '/admin/artworks', element: <AdminArtworks /> },
  { path: '/admin/blogs', element: <AdminBlogs /> },
  { path: '/admin/exhibitions', element: <AdminExhibitions /> },
  { path: '/admin/timeline', element: <AdminTimeline /> },
  { path: '/admin/comments', element: <AdminComments /> },
];

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#222222',
            color: '#f5f0e8',
            border: '1px solid rgba(201,168,76,0.2)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#1a1a1a' } },
          error: { iconTheme: { primary: '#b87c7c', secondary: '#1a1a1a' } },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
        <Route path="/gallery/:id" element={<MainLayout><ArtworkDetail /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/journal" element={<MainLayout><Journal /></MainLayout>} />
        <Route path="/journal/:id" element={<MainLayout><JournalDetail /></MainLayout>} />
        <Route path="/timeline" element={<MainLayout><Timeline /></MainLayout>} />
        <Route path="/exhibitions" element={<MainLayout><Exhibitions /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/favorites" element={<ProtectedRoute><MainLayout><Favorites /></MainLayout></ProtectedRoute>} />

        {/* Admin routes */}
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <AdminRoute>
                <AdminLayout>{element}</AdminLayout>
              </AdminRoute>
            }
          />
        ))}

        {/* 404 */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </>
  );
}
