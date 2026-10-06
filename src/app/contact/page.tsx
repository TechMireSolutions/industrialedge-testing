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
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/02/green-chameleon-s9CC2SKySJM-unsplash.jpg"
            alt="Contact background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs">Let&apos;s Connect</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">Contact Us</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg">
            Have a question or want to request a quotation? We&apos;re always ready to assist your business.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs">Reach Out</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Get In Touch</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Our procurement specialists are available to review your inquiries, provide formal quotations, or arrange an on-site visit to your facility.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Office Address</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan
                    </p>
                    <a
                      href="https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Direct Phone & WhatsApp</h4>
                    <p className="text-sm text-gray-600 mt-1">+92 332 2316225</p>
                    <p className="text-xs text-gray-500 mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Email Inquiries</h4>
                    <p className="text-sm text-gray-600 mt-1">info@industrialedge.pk</p>
                    <p className="text-xs text-gray-500 mt-0.5">Response within 24 business hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-slate-50 p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <p className="text-sm text-gray-600 mb-6">
                Fill in the details below with your required item list or specifications.
              </p>

              {submitted ? (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-green-900">Thank you for your inquiry!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    We have received your message. An Industrial Edge procurement representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                        placeholder="e.g. Tariq Khan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                        placeholder="e.g. Crescent Mills Ltd"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                        placeholder="name@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Procurement Category
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
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
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                      Requirements / BOQ Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                      placeholder="Please mention items, quantities, part numbers, or specifications..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
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
