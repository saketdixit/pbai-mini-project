import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin CMS Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContentEditor from './pages/admin/ContentEditor';

function AppLayout({ children }) {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminLogin && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminLogin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin CMS Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/content" element={<ContentEditor />} />

            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}
