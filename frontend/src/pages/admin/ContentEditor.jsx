import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function ContentEditor() {
  const [content, setContent] = useState({
    title: '',
    headline: '',
    story: '',
    contact_info: {
      estate_office: '',
      primary_email: '',
      exports_email: '',
      direct_phone: '',
      business_hours: '',
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await api.getAboutContent();
        setContent(data);
      } catch (err) {
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      await api.updateAboutContent(content);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update website content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E4DDD3] rounded w-1/3 mx-auto" />
          <div className="h-64 bg-[#E4DDD3] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E4DDD3]">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-xs font-semibold text-[#5C5751] hover:text-[#183526] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Product Manager
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#183526]">
            Heritage & About Content Editor
          </h1>
          <p className="text-xs text-[#5C5751] mt-1">
            Edit the brand story, terroir philosophy, and corporate office details displayed across the public website.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center text-xs font-semibold text-[#3E6B52] bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Changes Published
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* About Page Hero Texts */}
        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-[#183526] border-b border-[#E4DDD3] pb-2">
            Page Title & Sub-Headline
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#183526] mb-1">
              Main Section Title
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#183526] mb-1">
              Headline Quote
            </label>
            <input
              type="text"
              value={content.headline}
              onChange={(e) => setContent({ ...content, headline: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#183526] mb-1">
              Brand Story Narrative (Supports Markdown & Headings with ###)
            </label>
            <textarea
              rows={12}
              value={content.story}
              onChange={(e) => setContent({ ...content, story: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#183526]"
            />
          </div>
        </div>

        {/* Corporate Contact Info */}
        <div className="bg-white border border-[#E4DDD3] rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-[#183526] border-b border-[#E4DDD3] pb-2">
            Estate Office & Contact Dispatch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#183526] mb-1">
                Primary Inquiry Email
              </label>
              <input
                type="email"
                value={content.contact_info?.primary_email || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact_info: { ...content.contact_info, primary_email: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#183526] mb-1">
                Exports Desk Email
              </label>
              <input
                type="email"
                value={content.contact_info?.exports_email || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact_info: { ...content.contact_info, exports_email: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#183526] mb-1">
                Direct Hotline / Phone
              </label>
              <input
                type="text"
                value={content.contact_info?.direct_phone || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact_info: { ...content.contact_info, direct_phone: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#183526] mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={content.contact_info?.business_hours || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact_info: { ...content.contact_info, business_hours: e.target.value }
                })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#183526] mb-1">
              Physical Estate / Tasting Room Address
            </label>
            <input
              type="text"
              value={content.contact_info?.estate_office || ''}
              onChange={(e) => setContent({
                ...content,
                contact_info: { ...content.contact_info, estate_office: e.target.value }
              })}
              className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] shadow transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2 text-[#D4AF37]" />
                Publish Story & Info Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
