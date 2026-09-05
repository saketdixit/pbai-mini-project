import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, ArrowUpDown, Sparkles, CheckCircle2, 
  FileText, MessageSquare, LogOut, ExternalLink, RefreshCw, Eye
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProductEditor from './ProductEditor';

export default function AdminDashboard() {
  const { admin, logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'inquiries'
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [inquiryModalItem, setInquiryModalItem] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, inqs] = await Promise.all([
        api.getProducts(),
        api.getInquiries().catch(() => [])
      ]);
      setProducts(prods);
      setInquiries(inqs);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove '${name}' from the catalog?`)) {
      try {
        await api.deleteProduct(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const updated = await api.updateProduct(product.id, {
        is_featured: !product.is_featured
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      alert(err.message || 'Failed to toggle featured status');
    }
  };

  const handleToggleAvailable = async (product) => {
    try {
      const updated = await api.updateProduct(product.id, {
        is_available: !product.is_available
      });
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
    } catch (err) {
      alert(err.message || 'Failed to toggle availability status');
    }
  };

  const handleOrderChange = (id, newOrder) => {
    setProducts(products.map((p) => p.id === id ? { ...p, display_order: parseInt(newOrder) || 0 } : p));
  };

  const handleSaveOrder = async () => {
    setReordering(true);
    try {
      const payload = products.map((p) => ({ id: p.id, display_order: p.display_order }));
      const updated = await api.reorderProducts(payload);
      setProducts(updated);
      alert('Product ordering saved successfully.');
    } catch (err) {
      alert(err.message || 'Failed to save ordering');
    } finally {
      setReordering(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#183526] animate-spin mx-auto" />
          <p className="text-xs text-[#5C5751]">Loading Estate CMS Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#E4DDD3] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#A9713C]">
              Admin Control Center
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#183526]">
              Aura Catalog & Content Manager
            </h1>
            <p className="text-xs text-[#5C5751] mt-0.5">
              Logged in as <strong className="text-[#183526]">{admin?.username}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/content"
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-[#E4DDD3] hover:bg-[#C9BEAF] text-[#183526] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Edit About Story & Info
            </Link>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold border border-[#E4DDD3] bg-white text-[#5C5751] hover:text-[#183526]"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Live Site
            </Link>

            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-sm">
            <span className="text-xs text-[#5C5751] font-medium block">Total Harvest Lots</span>
            <span className="font-serif text-3xl font-bold text-[#183526] mt-1 block">{products.length}</span>
            <span className="text-[11px] text-[#A9713C] mt-1 block">Active across all terroirs</span>
          </div>

          <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-sm">
            <span className="text-xs text-[#5C5751] font-medium block">Signature Featured Lots</span>
            <span className="font-serif text-3xl font-bold text-[#183526] mt-1 block">
              {products.filter((p) => p.is_featured).length}
            </span>
            <span className="text-[11px] text-[#A9713C] mt-1 block">Highlighted on Home Page</span>
          </div>

          <div className="bg-white border border-[#E4DDD3] rounded-2xl p-5 shadow-sm">
            <span className="text-xs text-[#5C5751] font-medium block">Inquiries Received</span>
            <span className="font-serif text-3xl font-bold text-[#183526] mt-1 block">{inquiries.length}</span>
            <span className="text-[11px] text-[#3E6B52] mt-1 block">Wholesale & sample requests</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E4DDD3] mb-6 space-x-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'products'
                ? 'text-[#183526] border-b-2 border-[#183526]'
                : 'text-[#5C5751] hover:text-[#183526]'
            }`}
          >
            Product Catalog Management ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'inquiries'
                ? 'text-[#183526] border-b-2 border-[#183526]'
                : 'text-[#5C5751] hover:text-[#183526]'
            }`}
          >
            Wholesale Inquiries Log ({inquiries.length})
          </button>
        </div>

        {/* Tab 1: Product Table */}
        {activeTab === 'products' && (
          <div className="bg-white border border-[#E4DDD3] rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E4DDD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#183526]">Active Harvest Archive</h2>
                <p className="text-xs text-[#5C5751] mt-0.5">
                  Update lot details, change display ordering, or add new single-estate offerings.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={reordering}
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-[#E4DDD3] hover:bg-[#C9BEAF] text-[#183526] transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
                  Save Order
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedProduct(null); setEditorOpen(true); }}
                  className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#183526] hover:bg-[#2A4A38] text-[#FAF8F5] shadow"
                >
                  <Plus className="w-4 h-4 mr-1.5 text-[#D4AF37]" />
                  Add Harvest Lot
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#5C5751]">
                <thead className="bg-[#F3EFEA] text-[#183526] uppercase font-bold text-[10px] tracking-wider border-b border-[#E4DDD3]">
                  <tr>
                    <th className="px-5 py-3 w-16">Order</th>
                    <th className="px-5 py-3">Harvest / Product</th>
                    <th className="px-5 py-3">Terroir Origin</th>
                    <th className="px-5 py-3 text-center">Featured</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4DDD3]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Order Input */}
                      <td className="px-5 py-3">
                        <input
                          type="number"
                          value={p.display_order}
                          onChange={(e) => handleOrderChange(p.id, e.target.value)}
                          className="w-14 px-2 py-1 border border-[#E4DDD3] rounded text-center text-xs font-bold text-[#183526]"
                        />
                      </td>

                      {/* Product Thumbnail & Name */}
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg border border-[#E4DDD3] bg-stone-100 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#183526] text-sm block">
                              {p.name}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-[#A9713C] tracking-wide">
                              {p.category} • {p.flush || 'Harvest'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Origin */}
                      <td className="px-5 py-3">
                        <span className="font-medium text-[#183526] block">{p.origin}</span>
                        <span className="text-[10px] text-[#5C5751]">{p.grade || 'Orthodox Grade'}</span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            p.is_featured
                              ? 'bg-[#D4AF37] text-[#183526]'
                              : 'bg-stone-100 text-stone-400 hover:text-stone-700'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5 mr-1" />
                          {p.is_featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>

                      {/* Available Toggle */}
                      <td className="px-5 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailable(p)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            p.is_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.is_available ? 'Available' : 'Reserved'}
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => { setSelectedProduct(p); setEditorOpen(true); }}
                            className="p-1.5 text-[#5C5751] hover:text-[#183526] hover:bg-[#E4DDD3]/50 rounded-lg transition-colors"
                            title="Edit harvest"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete harvest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inquiries Table */}
        {activeTab === 'inquiries' && (
          <div className="bg-white border border-[#E4DDD3] rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E4DDD3]">
              <h2 className="font-serif text-xl font-bold text-[#183526]">Wholesale & Procurement Logs</h2>
              <p className="text-xs text-[#5C5751] mt-0.5">
                Record of all customer tasting kit requests and commercial inquiries submitted from the website.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#5C5751]">
                No inquiries received yet. Inquiries submitted on the website will be logged here and dispatched via email.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#5C5751]">
                  <thead className="bg-[#F3EFEA] text-[#183526] uppercase font-bold text-[10px] tracking-wider border-b border-[#E4DDD3]">
                    <tr>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Sender / Company</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Message Snippet</th>
                      <th className="px-5 py-3 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DDD3]">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-5 py-3 whitespace-nowrap text-[11px] text-[#5C5751]">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <strong className="text-[#183526] block">{inq.name}</strong>
                          <span className="text-[10px] text-[#A9713C]">{inq.company || 'Private Client'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="block text-[#183526]">{inq.email}</span>
                          <span className="text-[10px] text-[#5C5751]">{inq.phone || 'No phone'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E4DDD3] text-[#183526]">
                            {inq.inquiry_type}
                          </span>
                        </td>
                        <td className="px-5 py-3 max-w-xs truncate">
                          {inq.message}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setInquiryModalItem(inq)}
                            className="p-1.5 text-[#183526] hover:bg-[#E4DDD3] rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      <ProductEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        product={selectedProduct}
        onSaved={loadData}
      />

      {/* Inquiry Detail Inspector Modal */}
      {inquiryModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4DDD3] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-xl font-bold text-[#183526]">Inquiry Dossier</h3>
              <button onClick={() => setInquiryModalItem(null)} className="text-stone-400 hover:text-stone-800">
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-[#5C5751]">
              <p><strong>Name:</strong> {inquiryModalItem.name}</p>
              <p><strong>Email:</strong> {inquiryModalItem.email}</p>
              <p><strong>Phone:</strong> {inquiryModalItem.phone || 'N/A'}</p>
              <p><strong>Company:</strong> {inquiryModalItem.company || 'N/A'}</p>
              <p><strong>Type:</strong> {inquiryModalItem.inquiry_type}</p>
              <p><strong>Product Lot:</strong> {inquiryModalItem.product_slug || 'General Portfolio'}</p>
              <div className="pt-2">
                <strong className="block text-[#183526] mb-1">Message:</strong>
                <div className="p-3 rounded-lg bg-stone-50 border text-[#183526] whitespace-pre-wrap leading-relaxed">
                  {inquiryModalItem.message}
                </div>
              </div>
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setInquiryModalItem(null)}
                className="px-4 py-2 bg-[#183526] text-white text-xs font-semibold rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
