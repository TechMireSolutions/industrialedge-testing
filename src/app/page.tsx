"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Briefcase, 
  ShoppingBag,
  ChevronRight,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroDealSlider from "@/components/HeroDealSlider";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");

  const featuredProducts = PRODUCTS.slice(0, 8);
  const flashDeals = PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
      {/* Hero E-Commerce Banner (Fitted Exactly to Full Screen Viewport) */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-6 lg:py-0 lg:h-[calc(100vh-114px)] lg:flex lg:items-center">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="/uploads/2025/12/courier-service-for-the-delivery-of-goods-express-2023-12-05-02-45-15-utc-scaled-1.webp"
            alt="Industrial Logistics"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/60 z-0"></div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  Pakistan&apos;s Leading B2B Industrial E-Store
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight mb-4">
                  Procure Industrial Gear, Tools & Supplies <span className="text-blue-500">Online</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl">
                  Order high-spec power tools, HVAC equipment, OSHA-standard PPE, chemicals, and electrical gear with transparent pricing, instant online ordering, and fast doorstep delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 mb-8">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-blue-500/20 transition duration-200 gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Shop Store Catalog
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl hover:text-white transition duration-200"
                  >
                    Request Custom RFQ
                  </Link>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-6 pt-5 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="font-bold text-base text-white block">10,000+</span>
                    <span className="text-slate-400 text-[11px]">Available SKUs</span>
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">24 - 48 Hrs</span>
                    <span className="text-slate-400 text-[11px]">Nationwide Dispatch</span>
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">100% Tax</span>
                    <span className="text-slate-400 text-[11px]">FBR GST Invoices</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Continuous Live Deals Slider */}
            <div className="lg:col-span-5">
              <HeroDealSlider deals={PRODUCTS.slice(0, 6)} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar (Full Width & Clean) */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Shop by Department
            </h2>
            <Link href="/products" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              All Departments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat, idx) => (
              <Link
                key={idx}
                href={`/products?category=${cat.id}`}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-200 group text-center flex flex-col items-center justify-center shadow-2xs hover:shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                  {cat.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products E-Commerce Grid (Full Width) */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                Top Rated Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Trending Industrial Supplies
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-500 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
            >
              Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Flash Discount Banners (Full Width) */}
      <section className="py-12 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Bulk Wholesale Specials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Value Badges Banner (Full Width) */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Nationwide Dispatch</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Direct fleet to industrial parks in Karachi, Lahore, Faisalabad & Islamabad.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Certified Products</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">100% genuine products with manufacturer batch test reports.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">B2B Volume Rates</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tiered quantity discounts for manufacturing facilities & contractors.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Credit Terms</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Flexible 15 to 30 day credit lines available for registered corporate buyers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners Bar (Continuous Single Strip Marquee Slider) */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
        <div className="w-full text-center mb-6">
          <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            Supplying Products From Leading Industrial Brands
          </p>
        </div>

        {/* Single White / Slate Seamless Strip */}
        <div className="relative w-full bg-white dark:bg-slate-900 border-y border-slate-200/70 dark:border-slate-800 py-5 sm:py-7 overflow-hidden shadow-2xs">
          {/* Left & Right gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

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
                className="w-32 sm:w-44 lg:w-48 h-12 sm:h-16 lg:h-18 shrink-0 flex items-center justify-center relative opacity-95 hover:opacity-100 transition-opacity duration-200 px-1 rounded-lg bg-white/70 dark:bg-white/95"
              >
                <Image
                  src={logoSrc}
                  alt={`Partner ${idx + 1}`}
                  fill
                  className="object-contain transform hover:scale-105 transition-transform duration-200 p-1"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
