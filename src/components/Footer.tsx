import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-slate-300 border-t border-emerald-500/20">
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-14 h-14 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center shadow-xs">
                <Image
                  src="/logo-icon.webp"
                  alt="Industrial Edge Logo"
                  fill
                  className="object-contain p-1 transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col justify-center text-left">
                <span className="font-logo text-[19px] font-bold tracking-tight text-white leading-tight">
                  Industrial Edge
                </span>
                <span className="font-logo text-[10.5px] font-medium text-emerald-400 tracking-wider leading-tight mt-1">
                  Fulfillment Guaranteed
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              From office essentials to industrial supplies, we&apos;re your trusted procurement partner across Pakistan. Simplifying supply chains with reliability, competitive pricing, and timely deliveries.
            </p>

            {/* Social Handles */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/industrial-edge-pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1e2352] hover:bg-[#059669] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 shadow-sm hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66c0-.92-.74-1.66-1.66-1.66Z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/industrialedge.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1e2352] hover:bg-[#059669] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 shadow-sm hover:scale-105"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/923322316225"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1e2352] hover:bg-[#059669] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 shadow-sm hover:scale-105"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/industrialedge.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-[#1e2352] hover:bg-[#059669] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/60 shadow-sm hover:scale-105"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wider uppercase text-sm border-l-2 border-[#059669] pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" /> Services
                </Link>
              </li>
              <li>
                <Link href="/what-we-do" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" /> What We Do
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" /> Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#059669]" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supply Categories */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wider uppercase text-sm border-l-2 border-[#059669] pl-2">
              Core Supplies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>Electronic Appliances & IT Gear</li>
              <li>Hardware & Heavy Tools</li>
              <li>Office Supplies & Stationery</li>
              <li>Safety Gear (PPE) & Workwear</li>
              <li>Chemicals & Industrial Lubricants</li>
              <li>Electrical Components & Wiring</li>
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wider uppercase text-sm border-l-2 border-[#059669] pl-2">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">+92 332 2316225</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">info@industrialedge.pk</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-y-3">
          <p>© {new Date().getFullYear()} Industrial Edge. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>
              Designed by{" "}
              <a
                href="https://techmiresolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-emerald-500/40 hover:decoration-emerald-400 transition"
              >
                Techmire Solutions
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
