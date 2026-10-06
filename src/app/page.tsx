"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Briefcase, 
  ShoppingBag,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  Zap,
  CheckCircle2,
  Cpu,
  Wrench,
  HardHat,
  FlaskConical
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroDealSlider from "@/components/HeroDealSlider";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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

const CATEGORY_STYLES: Record<string, {
  bg: string;
  hoverBg: string;
  border: string;
  hoverBorder: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  hoverTextColor: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = {
  "electronic-appliances": {
    bg: "bg-blue-50/70",
    hoverBg: "hover:bg-blue-100/70",
    border: "border-blue-200/80",
    hoverBorder: "hover:border-blue-400",
    iconBg: "bg-blue-600 text-white shadow-blue-500/30",
    iconColor: "text-blue-600",
    textColor: "text-blue-950",
    hoverTextColor: "group-hover:text-blue-600",
    Icon: Cpu,
  },
  "hardware-tools": {
    bg: "bg-amber-50/70",
    hoverBg: "hover:bg-amber-100/70",
    border: "border-amber-200/80",
    hoverBorder: "hover:border-amber-400",
    iconBg: "bg-amber-600 text-white shadow-amber-500/30",
    iconColor: "text-amber-600",
    textColor: "text-amber-950",
    hoverTextColor: "group-hover:text-amber-600",
    Icon: Wrench,
  },
  "office-supplies": {
    bg: "bg-emerald-50/70",
    hoverBg: "hover:bg-emerald-100/70",
    border: "border-emerald-200/80",
    hoverBorder: "hover:border-emerald-400",
    iconBg: "bg-emerald-600 text-white shadow-emerald-500/30",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-950",
    hoverTextColor: "group-hover:text-emerald-600",
    Icon: Briefcase,
  },
  "safety-equipment": {
    bg: "bg-orange-50/70",
    hoverBg: "hover:bg-orange-100/70",
    border: "border-orange-200/80",
    hoverBorder: "hover:border-orange-400",
    iconBg: "bg-orange-600 text-white shadow-orange-500/30",
    iconColor: "text-orange-600",
    textColor: "text-orange-950",
    hoverTextColor: "group-hover:text-orange-600",
    Icon: HardHat,
  },
  "industrial-chemicals": {
    bg: "bg-purple-50/70",
    hoverBg: "hover:bg-purple-100/70",
    border: "border-purple-200/80",
    hoverBorder: "hover:border-purple-400",
    iconBg: "bg-purple-600 text-white shadow-purple-500/30",
    iconColor: "text-purple-600",
    textColor: "text-purple-950",
    hoverTextColor: "group-hover:text-purple-600",
    Icon: FlaskConical,
  },
  "electrical-components": {
    bg: "bg-cyan-50/70",
    hoverBg: "hover:bg-cyan-100/70",
    border: "border-cyan-200/80",
    hoverBorder: "hover:border-cyan-400",
    iconBg: "bg-cyan-600 text-white shadow-cyan-500/30",
    iconColor: "text-cyan-600",
    textColor: "text-cyan-950",
    hoverTextColor: "group-hover:text-cyan-600",
    Icon: Zap,
  },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");

  const featuredProducts = PRODUCTS.slice(0, 8);
  const flashDeals = PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);

  return (
    <div className="bg-[#f8fafc] min-h-screen selection:bg-[#059669] selection:text-white">
      {/* Hero E-Commerce Banner with Brand Navy & Emerald Glow */}
      <section className="relative bg-[#151838] text-white overflow-hidden py-8 lg:py-0 lg:h-[calc(100vh-114px)] lg:flex lg:items-center">
        {/* Ambient brand colored glowing orbs (Emerald & Deep Navy) */}
        <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-[#059669]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/uploads/2025/12/courier-service-for-the-delivery-of-goods-express-2023-12-05-02-45-15-utc-scaled-1.webp"
            alt="Industrial Logistics"
            fill
            className="object-cover scale-105 transition-transform duration-1000"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#151838] via-[#151838]/95 to-[#1e224d]/85 z-0"></div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs"
                >
                  Pakistan&apos;s Leading B2B Industrial E-Store
                </motion.div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
                  Procure Industrial Gear, Tools & Supplies{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                    Online
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                  Order high-spec power tools, HVAC equipment, OSHA-standard PPE, chemicals, and electrical gear with transparent pricing, instant online ordering, and fast doorstep delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] rounded-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all duration-200 gap-2 w-full sm:w-auto"
                    >
                      <ShoppingBag className="w-4 h-4" /> Shop Store Catalog
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-bold text-slate-200 bg-[#1e224d]/80 hover:bg-[#151838] border border-emerald-500/30 rounded-xl hover:text-white transition duration-200 w-full sm:w-auto hover:border-emerald-400"
                    >
                      Request Custom RFQ
                    </Link>
                  </motion.div>
                </div>

                {/* Highlights */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="grid grid-cols-3 gap-6 pt-5 border-t border-slate-700/80 text-xs"
                >
                  <div className="group cursor-default">
                    <span className="font-extrabold text-base text-white block group-hover:text-emerald-400 transition-colors">10,000+</span>
                    <span className="text-slate-400 text-[11px]">Available SKUs</span>
                  </div>
                  <div className="group cursor-default">
                    <span className="font-extrabold text-base text-white block group-hover:text-emerald-400 transition-colors">24 - 48 Hrs</span>
                    <span className="text-slate-400 text-[11px]">Nationwide Dispatch</span>
                  </div>
                  <div className="group cursor-default">
                    <span className="font-extrabold text-base text-white block group-hover:text-emerald-400 transition-colors">100% Tax</span>
                    <span className="text-slate-400 text-[11px]">FBR GST Invoices</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right: Continuous Live Deals Slider */}
            <div className="lg:col-span-5">
              <HeroDealSlider deals={PRODUCTS.slice(0, 6)} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar (Rich Industrial Surface With Logo Navy/Emerald Accents) */}
      <section className="py-14 bg-gradient-to-b from-slate-200/70 via-slate-100 to-slate-200/50 border-b border-slate-300/80">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold text-[#059669] uppercase tracking-wider block mb-1">
                Explore Segments
              </span>
              <h2 className="text-2xl font-black text-[#151838] tracking-tight">
                Shop by Department
              </h2>
            </div>
            <Link 
              href="/products" 
              className="text-xs font-bold text-[#059669] hover:text-[#047857] transition flex items-center gap-1 group bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60"
            >
              All Departments 
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
          >
            {CATEGORIES.filter((c) => c.id !== "all").map((cat, idx) => {
              const style = CATEGORY_STYLES[cat.id] || {
                bg: "bg-white",
                hoverBg: "hover:bg-slate-50",
                border: "border-slate-200/90",
                hoverBorder: "hover:border-slate-400",
                iconBg: "bg-slate-800 text-white shadow-slate-500/20",
                iconColor: "text-slate-700",
                textColor: "text-slate-900",
                hoverTextColor: "group-hover:text-slate-700",
                Icon: ShoppingBag,
              };
              const IconComponent = style.Icon;

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href={`/products?category=${cat.id}`}
                    className={`h-full p-5 rounded-2xl ${style.bg} ${style.hoverBg} border ${style.border} ${style.hoverBorder} transition-all duration-300 group text-center flex flex-col items-center justify-center shadow-xs hover:shadow-lg`}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${style.iconBg} shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <h4 className={`text-xs font-black ${style.textColor} ${style.hoverTextColor} line-clamp-2 transition-colors`}>
                      {cat.name}
                    </h4>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products E-Commerce Grid (Cool Soft Industrial Tint) */}
      <section className="py-16 bg-gradient-to-b from-[#f1f5f9] via-slate-100 to-slate-200/60 border-b border-slate-300/70">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider block mb-1">
                Top Rated Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151838] tracking-tight">
                Trending Industrial Supplies
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-[#059669] hover:text-[#059669] rounded-xl text-xs font-bold text-slate-700 transition shadow-xs hover:shadow-md group"
            >
              Browse Full Catalog 
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Discount Banners With Navy Deep Accent */}
      <section className="py-14 bg-gradient-to-br from-[#151838]/5 via-emerald-50/40 to-slate-100 border-y border-slate-200/80">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                <Flame className="w-5 h-5 animate-pulse text-red-600" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-[#151838]">
                  Bulk Wholesale Specials
                </h3>
                <p className="text-xs text-slate-500">Limited time discounted prices on high volume lots</p>
              </div>
            </div>
            <Link href="/products" className="text-xs font-bold text-[#059669] hover:underline">
              View All Deals →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Value Badges Banner with Brand Navy & Emerald Theme */}
      <section className="py-16 bg-gradient-to-b from-slate-100 to-slate-200/50 border-b border-slate-300/70">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200/70 hover:border-emerald-300 flex items-start gap-4 shadow-2xs hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-3 bg-emerald-100 text-[#059669] rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-[#059669] group-hover:text-white transition-all duration-300">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#151838] text-sm group-hover:text-[#059669] transition-colors">Nationwide Dispatch</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Direct fleet to industrial parks in Karachi, Lahore, Faisalabad & Islamabad.</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/70 hover:border-blue-300 flex items-start gap-4 shadow-2xs hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-3 bg-[#151838]/10 text-[#151838] rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-[#151838] group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#151838] text-sm group-hover:text-[#059669] transition-colors">Certified Products</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">100% genuine products with manufacturer batch test reports.</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200/70 hover:border-teal-300 flex items-start gap-4 shadow-2xs hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-3 bg-teal-100 text-teal-700 rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#151838] text-sm group-hover:text-[#059669] transition-colors">B2B Volume Rates</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tiered quantity discounts for manufacturing facilities & contractors.</p>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-cyan-50/30 border border-slate-200/70 hover:border-cyan-300 flex items-start gap-4 shadow-2xs hover:shadow-lg transition-all duration-300 group"
            >
              <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl shrink-0 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#151838] text-sm group-hover:text-[#059669] transition-colors">Credit Terms</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Flexible 15 to 30 day credit lines available for registered corporate buyers.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Partners Bar (Continuous Single Strip Marquee Slider) */}
      <section className="py-12 bg-slate-100/70 border-t border-slate-200/80 overflow-hidden">
        <div className="w-full text-center mb-6">
          <p className="text-xs uppercase font-bold text-[#151838]/70 tracking-wider">
            Supplying Products From Leading Industrial Brands
          </p>
        </div>

        {/* Single White Seamless Strip */}
        <div className="relative w-full bg-white border-y border-slate-200/80 py-5 sm:py-7 overflow-hidden shadow-2xs">
          {/* Left & Right gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-6 sm:gap-8 md:gap-10 items-center">
            {/* Repeat list twice for seamless infinite loop */}
            {[
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
              // Second set for seamless loop
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
              "/uploads/2025/02/24.png"
            ].map((logoSrc, idx) => (
              <div
                key={idx}
                className="w-32 sm:w-44 lg:w-48 h-12 sm:h-16 lg:h-18 shrink-0 flex items-center justify-center relative opacity-95 hover:opacity-100 transition-opacity duration-200 px-1"
              >
                <Image
                  src={logoSrc}
                  alt={`Partner ${idx + 1}`}
                  fill
                  className="object-contain transform hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
