import React, { useState } from 'react';
import { X, CheckCircle, Send, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export default function InquiryModal({ isOpen, onClose, product = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiry_type: product ? 'Sample Tasting Kit' : 'Wholesale & Export',
    message: product ? `Inquiring about harvest availability and sample testing for: ${product.name} (${product.category}).` : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.submitInquiry({
        ...formData,
        product_slug: product ? product.slug : null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to submit inquiry. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF8F5] border border-[#E4DDD3] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-[#5C5751] hover:text-[#183526] hover:bg-[#E4DDD3]/50 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#183526]/10 text-[#183526] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9 text-[#3E6B52]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#183526]">
              Inquiry Dispatched
            </h3>
            <p className="text-sm text-[#5C5751] max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[#183526]">{formData.name}</strong>. Your procurement request has been routed to our estate sommelier. We will send harvest details and sample documentation within 24 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-[#183526] hover:bg-[#2A4A38] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-full transition-all"
              >
                Close & Return to Catalog
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#A9713C] block mb-1">
                Direct Procurement & Tasting Kit
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#183526]">
                {product ? `Inquire About ${product.name}` : 'Wholesale & Export Inquiry'}
              </h2>
              <p className="text-xs text-[#5C5751] mt-1">
                Direct single-estate lot supply for tea houses, luxury hotels, and private-label partners.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#183526] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#183526] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="eleanor@luxuryteahouse.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#183526] mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#183526] mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Grand Pavilion Hotels"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#183526] mb-1">
                  Inquiry Purpose
                </label>
                <select
                  value={formData.inquiry_type}
                  onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                >
                  <option value="Sample Tasting Kit">Request Sample Tasting Kit (50g Lots)</option>
                  <option value="Wholesale & Export">Commercial Bulk / Wholesale Pricing</option>
                  <option value="Private Label & Packaging">Private Label Custom Packaging</option>
                  <option value="Tea Sommelier Consultation">Book a 30-min Tea Sommelier Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#183526] mb-1">
                  Requirements / Specifications *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention target volume, destination port, custom packaging needs, or specific harvest lot..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] disabled:opacity-60 transition-all shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Routing to Estate Sommelier...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-2 text-[#D4AF37]" />
                      Submit Procurement Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
