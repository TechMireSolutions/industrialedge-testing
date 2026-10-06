import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="bg-white p-2 rounded-lg inline-block">
                <Image
                  src="/uploads/2025/02/Industrial-Edge-Logo.webp"
                  alt="Industrial Edge Logo"
                  width={180}
                  height={50}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              From office essentials to industrial supplies, we&apos;re your trusted procurement partner across Pakistan. Simplifying supply chains with reliability, competitive pricing, and timely deliveries.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wider uppercase text-sm border-l-2 border-blue-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Services
                </Link>
              </li>
              <li>
                <Link href="/what-we-do" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> What We Do
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Supply Categories */}
          <div>
            <h4 className="text-white text-base font-semibold mb-4 tracking-wider uppercase text-sm border-l-2 border-blue-500 pl-2">
              Core Supplies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
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
            <h4 className="text-white text-base font-semibold mb-4 tracking-wider uppercase text-sm border-l-2 border-blue-500 pl-2">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">+92 332 2316225</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-300">info@industrialedge.pk</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-400">Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Industrial Edge. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Boost Your Business Procurement Across Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
