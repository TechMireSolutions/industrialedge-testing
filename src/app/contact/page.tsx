"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "General Procurement Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white py-16 sm:py-24 relative overflow-hidden border-b border-emerald-500/20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/02/green-chameleon-s9CC2SKySJM-unsplash.jpg"
            alt="Contact background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111538]/90 via-[#172554]/85 to-[#044337]/85"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
            Let&apos;s Connect
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 tracking-tight">Contact Us</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed">
            Have a question or want to request a quotation? We&apos;re always ready to assist your business.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact details Card with Brand Logo Gradient */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#111538] via-[#172554] to-[#044337] text-white p-7 sm:p-9 rounded-3xl border border-emerald-500/20 shadow-xl space-y-7 relative overflow-hidden">
              {/* Subtle ambient glow inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs mb-2">
                  Reach Out
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-2 mb-3 tracking-tight">Get In Touch</h2>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Our procurement specialists are available to review your inquiries, provide formal quotations, or arrange an on-site visit to your facility.
                </p>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-4 p-4.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xs transition">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 border border-emerald-400/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Office Address</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan
                    </p>
                    <a
                      href="https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline mt-1.5 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xs transition">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 border border-emerald-400/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Direct Phone & WhatsApp</h4>
                    <p className="text-xs text-slate-300 mt-1">+92 332 2316225</p>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-xs transition">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 border border-emerald-400/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Email Inquiries</h4>
                    <p className="text-xs text-slate-300 mt-1">info@industrialedge.pk</p>
                    <p className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">Response within 24 business hours</p>
                  </div>
                </div>

                {/* Social Channels Box */}
                <div className="p-4.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs">
                  <h4 className="font-bold text-white text-xs mb-3 tracking-wide uppercase">
                    Official Corporate Handles
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href="https://linkedin.com/company/industrial-edge-pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-[#059669] text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 hover:border-emerald-400"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://facebook.com/industrialedge.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-[#059669] text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 hover:border-emerald-400"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://wa.me/923322316225"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      WhatsApp
                    </a>
                    <a
                      href="https://instagram.com/industrialedge.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-[#059669] text-white text-xs font-bold transition flex items-center gap-1.5 border border-white/20 hover:border-emerald-400"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-bold text-[#151838] mb-2">Send Us a Message</h3>
              <p className="text-sm text-slate-600 mb-6">
                Fill in the details below with your required item list or specifications.
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-[#151838]">Thank you for your inquiry!</h4>
                  <p className="text-sm text-emerald-800 mt-1">
                    We have received your message. An Industrial Edge procurement representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#059669] to-[#047857] text-white rounded-xl text-xs font-bold hover:opacity-90 shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] focus:outline-none bg-slate-50 focus:bg-white text-sm transition"
                        placeholder="e.g. Tariq Khan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] focus:outline-none bg-slate-50 focus:bg-white text-sm transition"
                        placeholder="e.g. Crescent Mills Ltd"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] focus:outline-none bg-slate-50 focus:bg-white text-sm transition"
                        placeholder="name@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] focus:outline-none bg-slate-50 focus:bg-white text-sm transition"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Procurement Category
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] focus:outline-none bg-slate-50 focus:bg-white text-sm transition"
                    >
                      <option>General Procurement Inquiry</option>
                      <option>Electronic Appliances & IT Infrastructure</option>
                      <option>Hardware, Tools & Heavy Machinery</option>
                      <option>Office Supplies & Corporate Stationery</option>
                      <option>Safety Equipment (PPE) & Workwear</option>
                      <option>Chemicals & Industrial Lubricants</option>
                      <option>Electrical Switchgear & Industrial Cabling</option>
                      <option>Custom Industrial Sourcing / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Requirements / BOQ Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#059669] focus:outline-none bg-slate-50 focus:bg-white text-sm transition"
                      placeholder="Please mention items, quantities, part numbers, or specifications..."
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/30 transition cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="h-80 w-full bg-slate-200 relative border-t border-slate-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.015250493631!2d67.0267793!3d24.8633469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e134b2257e9%3A0xe5f928e1d2c6c39f!2sOdeon%20Center!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Industrial Edge Office Location"
        ></iframe>
      </section>
    </div>
  );
}
