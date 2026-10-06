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
  Clock, 
  Cpu, 
  Wrench, 
  Briefcase, 
  HardHat, 
  FlaskConical, 
  Zap, 
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");

  const featuredProducts = PRODUCTS.slice(0, 8);
  const flashDeals = PRODUCTS.filter((p) => p.originalPrice).slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero E-Commerce Banner */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pakistan&apos;s Leading B2B Industrial E-Store
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
                  Procure Industrial Gear, Tools & Supplies <span className="text-blue-500">Online</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
                  Order high-spec power tools, HVAC equipment, OSHA-standard PPE, chemicals, and electrical gear with transparent pricing, instant online ordering, and fast doorstep delivery.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/30 transition duration-200 gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Shop Store Catalog
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl hover:text-white transition duration-200"
                  >
                    Request Custom RFQ
                  </Link>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="font-bold text-base text-white block">10,000+</span>
                    <span className="text-slate-400">Available SKUs</span>
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">24 - 48 Hrs</span>
                    <span className="text-slate-400">Nationwide Dispatch</span>
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">100% Tax</span>
                    <span className="text-slate-400">FBR GST Invoices</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Featured Deal Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-white relative shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-lg uppercase">
                    <Flame className="w-3.5 h-3.5" /> Featured B2B Deal
                  </span>
                  <span className="text-xs text-slate-300 font-medium">In Stock (Limited Units)</span>
                </div>

                <div className="relative aspect-4/3 rounded-2xl bg-white/5 overflow-hidden p-6 mb-4 flex items-center justify-center">
                  <Image
                    src="/uploads/2025/03/200.png"
                    alt="Brushless Impact Drill"
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <h3 className="font-bold text-lg text-white mb-2">
                  Heavy-Duty Brushless Cordless Impact Drill Kit 20V
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                  Industrial 85Nm torque brushless motor with twin 4.0Ah batteries and heavy-duty case.
                </p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-2xl font-black text-white">PKR 24,500</span>
                  <span className="text-xs text-slate-400 line-through">PKR 28,000</span>
                  <span className="text-xs text-emerald-400 font-bold ml-auto">Save 13%</span>
                </div>

                <Link
                  href="/products/cordless-impact-drill-kit-20v"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                >
                  View Product Deal <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Shop by Department
            </h2>
            <Link href="/products" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              All Departments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat, idx) => (
              <Link
                key={idx}
                href={`/products?category=${cat.id}`}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-all duration-200 group text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2">
                  {cat.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products E-Commerce Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                Top Rated Sourcing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Trending Industrial Supplies
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-blue-500 rounded-xl text-xs font-semibold text-slate-700 transition"
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

      {/* Flash Discount Banners */}
      <section className="py-10 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-red-600" />
            <h3 className="text-xl font-black text-slate-900">
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

      {/* Value Badges Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Nationwide Dispatch</h4>
                <p className="text-xs text-slate-500 mt-1">Direct fleet to industrial parks in Karachi, Lahore, Faisalabad & Islamabad.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Certified Products</h4>
                <p className="text-xs text-slate-500 mt-1">100% genuine products with manufacturer batch test reports.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">B2B Volume Rates</h4>
                <p className="text-xs text-slate-500 mt-1">Tiered quantity discounts for manufacturing facilities & contractors.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Credit Terms</h4>
                <p className="text-xs text-slate-500 mt-1">Flexible 15 to 30 day credit lines available for registered corporate buyers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partners Bar */}
      <section className="py-12 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-6">
            Supplying Products From Leading Industrial Brands
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 p-2 flex items-center justify-center relative shadow-2xs">
                <Image
                  src={`/uploads/2025/02/${i}-1.png`}
                  alt={`Brand ${i}`}
                  fill
                  className="object-contain p-2 grayscale hover:grayscale-0 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
