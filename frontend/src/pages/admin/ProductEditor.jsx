import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Loader2, Save } from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = [
  'Black Tea',
  'Green Tea',
  'White Tea',
  'Oolong',
  'Herbal / Tisane'
];

export default function ProductEditor({ isOpen, onClose, product = null, onSaved }) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    category: product?.category || 'Black Tea',
    origin: product?.origin || '',
    flush: product?.flush || '',
    grade: product?.grade || '',
    short_description: product?.short_description || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    is_featured: product ? !!product.is_featured : false,
    display_order: product ? product.display_order : 0,
    is_available: product ? product.is_available !== false : true,
    flavor_notes: product?.flavor_notes || ['Muscatel', 'Honey'],
    brewing_guide: product?.brewing_guide || {
      temp: '85°C / 185°F',
      steep_time: '3 mins',
      ratio: '2.5g per 200ml',
      infusions: 3
    }
  });

  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: !isEditing ? generatedSlug : prev.slug
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.flavor_notes.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        flavor_notes: [...prev.flavor_notes, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      flavor_notes: prev.flavor_notes.filter((_, idx) => idx !== index)
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      setError(err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        await api.updateProduct(product.id, formData);
      } else {
        await api.createProduct(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-[#FAF8F5] border border-[#E4DDD3] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E4DDD3]">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#183526]">
              {isEditing ? `Edit: ${product.name}` : 'Catalog New Harvest Lot'}
            </h2>
            <p className="text-xs text-[#5C5751] mt-0.5">
              Enter terroir specifications, tasting tags, and sommelier brewing guides.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5C5751] hover:text-[#183526] rounded-full hover:bg-[#E4DDD3]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                Harvest Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Castleton Muscatel Second Flush"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526]"
              />
            </div>
          </div>

          {/* Row 2: Category, Origin, Grade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                Origin & Terroir *
              </label>
              <input
                type="text"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g. Darjeeling (5,400 ft)"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                Plucking Grade
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g. FTGFOP1 Special"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>
          </div>

          {/* Row 3: Flush & Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                Harvest Flush
              </label>
              <input
                type="text"
                value={formData.flush}
                onChange={(e) => setFormData({ ...formData, flush: e.target.value })}
                placeholder="e.g. First Flush 2026"
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#183526] mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
            </div>

            <div className="flex items-center space-x-6 pt-5">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded text-[#183526] focus:ring-[#183526] h-4 w-4"
                />
                <span className="ml-2 text-xs font-medium text-[#183526]">Featured Lot</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="rounded text-[#183526] focus:ring-[#183526] h-4 w-4"
                />
                <span className="ml-2 text-xs font-medium text-[#183526]">Available</span>
              </label>
            </div>
          </div>

          {/* Row 4: Image Upload & URL */}
          <div>
            <label className="block text-xs font-semibold text-[#183526] mb-1">
              Product Image URL or Upload *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... or upload local file"
                className="flex-1 px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
              />
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#E4DDD3] hover:bg-[#C9BEAF] text-[#183526] text-xs font-semibold rounded-lg transition-colors">
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Row 5: Short & Long Description */}
          <div>
            <label className="block text-xs font-semibold text-[#183526] mb-1">
              Short Summary (Card Preview) *
            </label>
            <input
              type="text"
              required
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="1-2 sentences highlighting key flavor and aroma..."
              className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#183526] mb-1">
              Full Terroir Narrative & Description *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Full narrative detailing origin, garden history, processing, and tasting notes..."
              className="w-full px-3.5 py-2 rounded-lg border border-[#E4DDD3] text-sm"
            />
          </div>

          {/* Row 6: Tasting Notes Builder */}
          <div>
            <label className="block text-xs font-semibold text-[#183526] mb-1">
              Flavor Notes Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.flavor_notes.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#183526] text-[#FAF8F5]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="ml-1.5 hover:text-[#D4AF37]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Add tasting tag (e.g. Muscatel, Stone Fruit)..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#E4DDD3] text-xs"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#183526] text-[#FAF8F5] text-xs font-semibold rounded-lg"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Row 7: Brewing Guide Parameters */}
          <div className="p-4 rounded-xl bg-[#F3EFEA] border border-[#E4DDD3] space-y-3">
            <span className="text-xs font-bold text-[#183526] block">
              Brewing Matrix Parameters
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#5C5751] mb-1">Water Temp</label>
                <input
                  type="text"
                  value={formData.brewing_guide.temp}
                  onChange={(e) => setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, temp: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E4DDD3] rounded"
                />
              </div>
              <div>
                <label className="block font-medium text-[#5C5751] mb-1">Steep Duration</label>
                <input
                  type="text"
                  value={formData.brewing_guide.steep_time}
                  onChange={(e) => setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, steep_time: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E4DDD3] rounded"
                />
              </div>
              <div>
                <label className="block font-medium text-[#5C5751] mb-1">Leaf Ratio</label>
                <input
                  type="text"
                  value={formData.brewing_guide.ratio}
                  onChange={(e) => setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, ratio: e.target.value }
                  })}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E4DDD3] rounded"
                />
              </div>
              <div>
                <label className="block font-medium text-[#5C5751] mb-1">Infusions</label>
                <input
                  type="number"
                  value={formData.brewing_guide.infusions}
                  onChange={(e) => setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, infusions: parseInt(e.target.value) || 3 }
                  })}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#E4DDD3] rounded"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#E4DDD3] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#5C5751] hover:bg-[#E4DDD3]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] shadow"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving Lot...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                  {isEditing ? 'Update Harvest' : 'Publish to Catalog'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
