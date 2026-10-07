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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-[#059669] font-bold tracking-wider uppercase text-xs">Reach Out</span>
                <h2 className="text-3xl font-extrabold text-[#151838] mt-2 mb-4 tracking-tight">Get In Touch</h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Our procurement specialists are available to review your inquiries, provide formal quotations, or arrange an on-site visit to your facility.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="p-3 bg-emerald-50 text-[#059669] rounded-xl shrink-0 border border-emerald-100">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151838] text-base">Office Address</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan
                    </p>
                    <a
                      href="https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#059669] hover:underline mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="p-3 bg-emerald-50 text-[#059669] rounded-xl shrink-0 border border-emerald-100">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151838] text-base">Direct Phone & WhatsApp</h4>
                    <p className="text-sm text-slate-600 mt-1">+92 332 2316225</p>
                    <p className="text-xs text-slate-500 mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="p-3 bg-emerald-50 text-[#059669] rounded-xl shrink-0 border border-emerald-100">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151838] text-base">Email Inquiries</h4>
                    <p className="text-sm text-slate-600 mt-1">info@industrialedge.pk</p>
                    <p className="text-xs text-slate-500 mt-0.5">Response within 24 business hours</p>
                  </div>
                </div>

                {/* Social Channels Box */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-[#151838] text-sm mb-3">Official Corporate Handles</h4>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://linkedin.com/company/industrial-edge-pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#151838] text-slate-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://facebook.com/industrialedge.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#151838] text-slate-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://wa.me/923322316225"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-[#059669] text-[#059669] hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-emerald-200/60"
                    >
                      WhatsApp
                    </a>
                    <a
                      href="https://instagram.com/industrialedge.pk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#151838] text-slate-700 hover:text-white text-xs font-bold transition flex items-center gap-1.5"
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

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-700/30 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Submit Inquiry
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
