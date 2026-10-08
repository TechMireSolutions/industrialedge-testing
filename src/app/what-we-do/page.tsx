import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Truck, Headphones, Search, Layers } from "lucide-react";

export const metadata = {
  title: "What We Do - Industrial Edge",
  description: "Discover how Industrial Edge empowers businesses with supply chain management, vendor consolidation, and bulk procurement.",
};

export default function WhatWeDoPage() {
  const features = [
    {
      title: "Vendor Consolidation",
      desc: "Stop dealing with 50 separate vendors for office, tool, and mechanical supplies. Consolidate your purchasing into one audited vendor.",
      icon: Layers,
    },
    {
      title: "Strategic Procurement Analysis",
      desc: "We analyze your recurring purchase lists to uncover volume discounts, reduce delivery frequency costs, and standardize item quality.",
      icon: Search,
    },
    {
      title: "Doorstep Industrial Logistics",
      desc: "Safe transport with dedicated industrial fleet ensuring zero damage to delicate electronics, heavy tool boxes, or bulk chemicals.",
      icon: Truck,
    },
    {
      title: "Corporate Account Managers",
      desc: "Every corporate client receives an assigned account manager for instant RFQ turnarounds, purchase orders, and urgent dispatches.",
      icon: Headphones,
    },
  ];

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white py-16 sm:py-24 relative overflow-hidden border-b border-emerald-500/20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/02/towfiqu-barbhuiya-nApaSgkzaxg-unsplash.jpg"
            alt="Business procurement overview"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111538]/90 via-[#172554]/85 to-[#044337]/85"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
            Our Value Engine
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 tracking-tight">What We Do</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed">
            We bridge the gap between industrial manufacturers, corporate offices, and reliable supply chains across Pakistan.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <span className="text-[#059669] font-bold tracking-wider uppercase text-xs">Transforming Operations</span>
              <h2 className="text-3xl font-extrabold text-[#151838] mt-2 sm:text-4xl mb-6">
                End-to-End Procurement Lifecycle
              </h2>
              <p className="text-slate-700 leading-relaxed mb-6 text-sm sm:text-base">
                Most companies lose hours every week negotiating with multiple local shopkeepers, dealing with unvetted qualities, and handling inconsistent invoices.
              </p>
              <p className="text-slate-700 leading-relaxed mb-6 text-sm sm:text-base">
                Industrial Edge acts as your off-site procurement department. We source, negotiate wholesale pricing, verify quality standards, inspect packaging, and deliver directly to your designated facility.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <span>Guaranteed authentic parts & genuine brands</span>
                </div>
                <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <span>Single unified monthly statement & tax credit invoices</span>
                </div>
                <div className="flex items-center gap-3 text-slate-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                  <span>Rapid replacement guarantee for any discrepancies</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3 border-4 border-white">
              <Image
                src="/uploads/2025/02/post2.jpg"
                alt="Procurement in action"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition group">
                  <div className="w-14 h-14 rounded-2xl bg-[#151838]/5 text-[#151838] group-hover:bg-gradient-to-r group-hover:from-[#151838] group-hover:to-[#059669] group-hover:text-white flex items-center justify-center mb-6 transition-all duration-300 shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#151838] group-hover:text-[#059669] mb-3 transition-colors">{f.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner (Contrasting from Footer) */}
      <section className="py-20 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border-t border-slate-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#151838] via-[#1a1f4a] to-[#047857] text-white text-center p-10 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden border border-emerald-500/20">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold tracking-wider uppercase text-xs mb-3 shadow-xs">
                Ready to Begin?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Have a procurement list ready?</h2>
              <p className="text-slate-200 mt-4 mb-8 text-sm sm:text-base leading-relaxed">
                Send us your BOQ or items list and let our team provide an unbeatable quotation within 24 hours.
              </p>
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold rounded-xl shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all duration-200 inline-block text-sm"
              >
                Submit Your BOQ Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
