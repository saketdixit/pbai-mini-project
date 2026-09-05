import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, Leaf, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('AuraTeaAdmin2026!');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-[#183526] text-[#D4AF37] flex items-center justify-center mx-auto mb-3 shadow-md">
          <Leaf className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#183526]">
          Aura CMS Portal
        </h2>
        <p className="mt-1 text-xs text-[#5C5751]">
          Estate Catalog & Content Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 border border-[#E4DDD3] rounded-3xl shadow-lg">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#183526] mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#183526] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] disabled:opacity-60 transition-all shadow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-2 text-[#D4AF37]" />
                    Access Dashboard
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E4DDD3] text-center">
            <Link to="/" className="text-xs text-[#A9713C] hover:underline font-medium">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
