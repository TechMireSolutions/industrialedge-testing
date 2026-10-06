"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/data/products";

interface HeroDealSliderProps {
  deals: Product[];
}

export default function HeroDealSlider({ deals }: HeroDealSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 3.5 seconds continuously
  useEffect(() => {
    if (!deals || deals.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deals.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [deals]);

  if (!deals || deals.length === 0) return null;

  const currentDeal = deals[currentIndex];
  const discountPercent = currentDeal.originalPrice
    ? Math.round(((currentDeal.originalPrice - currentDeal.price) / currentDeal.originalPrice) * 100)
    : 0;

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[520px] bg-gradient-to-br from-white/10 via-[#1e2352]/40 to-[#151838]/80 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-2xl overflow-hidden group">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#059669]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#06b6d4]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Tag & Interactive Indicators */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
            <Flame className="w-3.5 h-3.5 animate-pulse" /> Live B2B Deal
          </span>
          <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">
            Deal {currentIndex + 1} of {deals.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-full backdrop-blur-xs border border-white/10">
          {deals.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "w-6 bg-gradient-to-r from-[#059669] to-[#06b6d4]" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Animated Slide Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDeal.id}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col justify-between h-full"
          >
            {/* Large Product Showcase Area */}
            <div className="relative w-full aspect-16/10 sm:aspect-16/9 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 flex items-center justify-center my-auto overflow-hidden shadow-inner group/img">
              <div className="relative w-full h-full transform group-hover/img:scale-105 transition-transform duration-500">
                <Image
                  src={currentDeal.image}
                  alt={currentDeal.name}
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              {discountPercent > 0 && (
                <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg">
                  -{discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Product Meta & Details */}
            <div className="pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {currentDeal.category.replace("-", " ")}
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-white mb-2 line-clamp-1">
                {currentDeal.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {currentDeal.description}
              </p>

              {/* Price & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-white">
                    PKR {currentDeal.price.toLocaleString()}
                  </span>
                  {currentDeal.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      PKR {currentDeal.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-slate-300 font-medium">
                    /{currentDeal.unit}
                  </span>
                </div>

                <Link
                  href={`/products/${currentDeal.slug}`}
                  className="px-6 py-3 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 hover:shadow-emerald-600/50 transition-all duration-200"
                >
                  View Product Deal <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left/Right Arrow Controls */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? deals.length - 1 : prev - 1))}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-[#059669] text-white border border-white/10 hover:border-[#059669] transition duration-200 backdrop-blur-md z-20 cursor-pointer shadow-lg"
        aria-label="Previous Deal"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % deals.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-[#059669] text-white border border-white/10 hover:border-[#059669] transition duration-200 backdrop-blur-md z-20 cursor-pointer shadow-lg"
        aria-label="Next Deal"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
