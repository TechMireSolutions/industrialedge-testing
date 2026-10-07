"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function PortfolioPage() {
  const projects = [
    {
      title: "Commercial Facility Modernization",
      category: "IT & Electronic Infrastructure",
      desc: "Delivered enterprise network routing gear, cooling units, and 50+ ergonomic workstations to a Karachi corporate headquarter.",
      image: "/uploads/2025/02/coorp-4.jpg",
    },
    {
      title: "Heavy Manufacturing Tooling Outfitting",
      category: "Hardware & Machinery",
      desc: "Supplied precision cordless drills, pneumatic tools, safety gear, and industrial fasteners to an assembly plant in Lahore.",
      image: "/uploads/2025/02/coorp-16.jpg",
    },
    {
      title: "Nationwide Office Consumables Supply",
      category: "Corporate Stationery & Consumables",
      desc: "Monthly scheduled deliveries of premium stationery, paper, cleaning chemicals, and pantry supplies to multi-city branch network.",
      image: "/uploads/2025/02/post5.jpg",
    },
  ];

  // Brand logos extracted from WP
  const partnerLogos = [
    "/uploads/2025/02/1-1.png",
    "/uploads/2025/02/2-2.png",
    "/uploads/2025/02/3-1.png",
    "/uploads/2025/02/4-1.png",
    "/uploads/2025/02/5-2.png",
    "/uploads/2025/02/6-1.png",
    "/uploads/2025/02/7-1.png",
    "/uploads/2025/02/8-1.png",
    "/uploads/2025/02/9-1.png",
    "/uploads/2025/02/10-1.png",
    "/uploads/2025/02/11-1.png",
    "/uploads/2025/02/12-1.png",
    "/uploads/2025/02/13-1.png",
    "/uploads/2025/02/14.png",
    "/uploads/2025/02/15.png",
    "/uploads/2025/02/16.png",
    "/uploads/2025/02/17.png",
    "/uploads/2025/02/18.png",
    "/uploads/2025/02/19.png",
    "/uploads/2025/02/20.png",
    "/uploads/2025/02/21.png",
    "/uploads/2025/02/22.png",
    "/uploads/2025/02/23.png",
    "/uploads/2025/02/24.png",
  ];

  return (
    <div>
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white py-16 sm:py-24 relative overflow-hidden border-b border-emerald-500/20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
              Our Track Record
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 tracking-tight">Portfolio & Partner Brands</h1>
            <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed">
              Discover our proven delivery capability and the extensive network of industrial brands we supply.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-[#059669] font-bold tracking-wider uppercase text-xs">Recent Highlights</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151838] mt-2 tracking-tight">Featured Procurement Deliveries</h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {projects.map((p, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#059669] uppercase tracking-wider block mb-2">{p.category}</span>
                    <h3 className="text-lg font-bold text-[#151838] mb-3 group-hover:text-[#059669] transition-colors">{p.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{p.desc}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-xs font-bold text-[#059669] hover:text-[#047857] gap-1.5 mt-auto group/link"
                  >
                    Request Similar Supplies 
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partner Brands Grid with Staggered Fade In */}
      <section className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-[#059669] font-bold tracking-wider uppercase text-xs">Certified Sourcing</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151838] mt-2 tracking-tight">Brands & Partners We Supply</h2>
            <p className="text-slate-600 mt-4 text-base">
              We procure and distribute products from industry-leading global and local manufacturers.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 items-center"
          >
            {partnerLogos.map((logo, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.06, y: -3, transition: { duration: 0.2 } }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center h-24 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 cursor-pointer"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={logo}
                    alt={`Partner ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
