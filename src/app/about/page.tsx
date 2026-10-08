import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Target, Eye, Award, Users, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "About Us - Industrial Edge",
  description: "Learn about Industrial Edge, our mission, vision, and how we reshape business procurement across Pakistan.",
};

export default function AboutPage() {
  const principles = [
    {
      title: "Understanding Your Needs",
      desc: "We start by deeply analyzing your operational workflow, parts specifications, and frequency of order to tailor procurement schedules.",
    },
    {
      title: "Vetted Supplier Network",
      desc: "Access to hundreds of pre-audited manufacturers, importers, and authorized distributors ensuring 100% genuine products.",
    },
    {
      title: "Quality Assurance",
      desc: "Every shipment undergoes pre-dispatch inspection so that damaged or defective components never reach your factory floor.",
    },
    {
      title: "Prompt Logistics & Tracking",
      desc: "Swift dispatch to any location in Pakistan with live tracking updates and confirmed delivery receipts.",
    },
  ];

  return (
    <div>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white py-16 sm:py-24 relative overflow-hidden border-b border-emerald-500/20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/02/diverse-storehouse-team-scanning-cardboard-boxes-2023-11-27-05-24-06-utc-scaled.jpg"
            alt="Storehouse team"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111538]/90 via-[#172554]/85 to-[#044337]/85"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
            Who We Are
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 tracking-tight">About Industrial Edge</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed">
            Empowering Pakistani enterprises, manufacturers, and corporate businesses with dependable, friction-free procurement solutions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#059669] font-bold tracking-wider uppercase text-xs">Our Background</span>
              <h2 className="text-3xl font-extrabold text-[#151838] mt-2 sm:text-4xl mb-6">
                Reshaping The Procurement Landscape
              </h2>
              <p className="text-slate-700 leading-relaxed mb-6 text-sm sm:text-base">
                At Industrial Edge, our vision is to reshape the procurement landscape by providing businesses across Pakistan with reliable, cost-effective, and hassle-free sourcing solutions.
              </p>
              <p className="text-slate-700 leading-relaxed mb-6 text-sm sm:text-base">
                Whether you need everyday office consumables, computing infrastructure, heavy-duty workshop machinery, or specialized industrial chemicals, our multi-sector sourcing network eliminates the need to coordinate with dozens of distinct vendors.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <h4 className="text-2xl font-black text-[#151838] mb-1">Single Point</h4>
                  <p className="text-xs text-slate-500">Contact for all procurement needs</p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <h4 className="text-2xl font-black text-[#059669] mb-1">Corporate</h4>
                  <p className="text-xs text-slate-500">Compliance & GST-ready invoicing</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3 border-4 border-white">
              <Image
                src="/uploads/2025/02/diverse-storehouse-team-scanning-cardboard-boxes-2023-11-27-05-24-06-utc-scaled.jpg"
                alt="Industrial team inspection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white relative overflow-hidden border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1e2352]/70 p-8 sm:p-10 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  To provide seamless, authentic, and fast procurement services that minimize operational downtime for Pakistani businesses while delivering maximum value and cost efficiency.
                </p>
              </div>
            </div>

            <div className="bg-[#1e2352]/70 p-8 sm:p-10 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-500/30">
                  <Eye className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  To become Pakistan&apos;s foremost B2B procurement and supply chain powerhouse, recognized for integrity, customer-first service, and technological efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-gradient-to-b from-slate-100 to-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#059669] font-bold tracking-wider uppercase text-xs">Our Methodology</span>
            <h2 className="text-3xl font-black text-[#151838] mt-2 sm:text-4xl">How We Work</h2>
            <p className="text-slate-600 mt-4 text-base">
              At Industrial Edge, we combine deep industry expertise with a customer-first approach to ensure every transaction is smooth and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((p, idx) => (
              <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
                <CheckCircle2 className="w-6 h-6 text-[#059669] shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-[#151838] mb-2">{p.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold rounded-xl shadow-lg shadow-emerald-700/30 transition"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
