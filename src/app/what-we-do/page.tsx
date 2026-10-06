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
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/02/towfiqu-barbhuiya-nApaSgkzaxg-unsplash.jpg"
            alt="Business procurement overview"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs">Our Value Engine</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">What We Do</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg">
            We bridge the gap between industrial manufacturers, corporate offices, and reliable supply chains across Pakistan.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs">Transforming Operations</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 sm:text-4xl mb-6">
                End-to-End Procurement Lifecycle
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Most companies lose hours every week negotiating with multiple local shopkeepers, dealing with unvetted qualities, and handling inconsistent invoices.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Industrial Edge acts as your off-site procurement department. We source, negotiate wholesale pricing, verify quality standards, inspect packaging, and deliver directly to your designated facility.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span>Guaranteed authentic parts & genuine brands</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span>Single unified monthly statement & tax credit invoices</span>
                </div>
                <div className="flex items-center gap-3 text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span>Rapid replacement guarantee for any discrepancies</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3">
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
                <div key={i} className="p-8 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-sm transition">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold sm:text-4xl">Have a procurement list ready?</h2>
          <p className="text-blue-100 mt-3 mb-8">
            Send us your BOQ or items list and let our team provide an unbeatable quotation within 24 hours.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg shadow hover:bg-slate-100 transition inline-block"
          >
            Submit Your BOQ Now
          </Link>
        </div>
      </section>
    </div>
  );
}
