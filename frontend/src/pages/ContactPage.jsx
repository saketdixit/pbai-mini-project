import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiry_type: 'Wholesale & Export',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.submitInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#A9713C] block mb-2">
            Procurement & Inquiries
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#183526] tracking-tight">
            Connect with Our Estate Team
          </h1>
          <p className="text-sm sm:text-base text-[#5C5751] mt-3 font-light leading-relaxed">
            Whether you are curating a custom tea service for a luxury hotel, inquiring about export logistics, or requesting harvest sample kits, our tea sommelier desk is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Corporate & Estate Office Details (inspired by pbai.in) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F3EFEA] border border-[#E4DDD3] rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#183526]">
                Estate & Export Office
              </h2>
              
              <div className="space-y-4 text-sm text-[#5C5751]">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#A9713C] mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#183526] font-semibold">Tasting Room & Office</strong>
                    <span>Aura Tea Pavilion, Mountain Vista Road, Kurseong, Darjeeling, West Bengal 734203</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-[#A9713C] mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#183526] font-semibold">Inquiry Dispatch</strong>
                    <span>inquiries@aurateas.example.com</span>
                    <br />
                    <span>exports@aurateas.example.com</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-[#A9713C] mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#183526] font-semibold">Telephone & WhatsApp Direct</strong>
                    <span>+91-9876543210 / +91-8101287339</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#A9713C] mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#183526] font-semibold">Operational Hours</strong>
                    <span>Monday – Saturday: 09:00 AM – 07:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* B2B Trust Proof */}
            <div className="p-6 rounded-2xl bg-[#183526] text-[#FAF8F5] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                Export Compliance Ready
              </span>
              <p className="text-xs text-[#FAF8F5]/80 font-light leading-relaxed">
                All export shipments are accompanied by official Certificate of Analysis (COA), Phytosanitary clearances, and origin traceability documentation for international customs.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#E4DDD3] rounded-3xl p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#183526]/10 text-[#183526] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9 text-[#3E6B52]" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-[#183526]">
                  Inquiry Received
                </h2>
                <p className="text-sm text-[#5C5751] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#183526]">{formData.name}</strong>. Your communication has been dispatched to our sales and sommelier division. We will review your requirements and respond within 24 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        inquiry_type: 'Wholesale & Export',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-[#183526] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#2A4A38] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="font-serif text-2xl font-bold text-[#183526]">
                    Wholesale & Tasting Kit Inquiry
                  </h2>
                  <p className="text-xs text-[#5C5751] mt-1">
                    Please complete the form below. Direct growers pricing is provided to qualified hospitality and retail accounts.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#183526] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Marcus Thorne"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#183526] mb-1">
                        Corporate / Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="marcus@grandhotel.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#183526] mb-1">
                        Telephone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 415-555-0123"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#183526] mb-1">
                        Company or Establishment
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Thorne Specialty Beverage Group"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#183526] mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiry_type}
                      onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                    >
                      <option value="Wholesale & Export">Commercial Bulk / Wholesale Pricing</option>
                      <option value="Sample Tasting Kit">Request 50g Sample Tasting Kit</option>
                      <option value="Private Label & Custom Blending">Private Label Custom Packaging</option>
                      <option value="Hospitality Tea Program Consultation">Hospitality Tea Service Consultation</option>
                      <option value="General Inquiries">General Customer Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#183526] mb-1">
                      Project Details / Volume Requirements *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your venue, expected monthly leaf volume, target delivery region, or specific teas of interest..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4DDD3] text-sm focus:outline-none focus:ring-1 focus:ring-[#183526] focus:border-[#183526]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#FAF8F5] bg-[#183526] hover:bg-[#2A4A38] disabled:opacity-60 transition-all shadow-md"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting to Sommelier Desk...
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
      </div>
    </div>
  );
}
