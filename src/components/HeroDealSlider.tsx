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
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 5 seconds, pauses when user hovers to click
  useEffect(() => {
    if (!deals || deals.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deals.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [deals, isPaused]);

  if (!deals || deals.length === 0) return null;

  const currentDeal = deals[currentIndex];
  const discountPercent = currentDeal.originalPrice
    ? Math.round(((currentDeal.originalPrice - currentDeal.price) / currentDeal.originalPrice) * 100)
    : 0;

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-full min-h-[460px] lg:min-h-[520px] flex flex-col justify-between overflow-hidden group"
    >
      {/* Top Header Tag & Interactive Indicators */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm">
            <Flame className="w-3.5 h-3.5 animate-pulse" /> Live B2B Deal
          </span>
          <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
            Deal {currentIndex + 1} of {deals.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#1e2352]/70 p-1.5 rounded-full border border-slate-700/50">
          {deals.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "w-6 bg-gradient-to-r from-[#059669] to-[#06b6d4]" : "w-2 bg-slate-500/50 hover:bg-slate-400"
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
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col justify-between h-full"
          >
            {/* Clean Product Showcase Area Without Glassmorphism */}
            <div className="relative w-full aspect-16/10 sm:aspect-16/9 rounded-2xl bg-[#1e224d]/60 border border-slate-700/60 p-6 flex items-center justify-center my-auto overflow-hidden group/img">
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
                <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  -{discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Product Meta (Title, Price & Action) without description */}
            <div className="pt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {currentDeal.category.replace("-", " ")}
              </span>
              <h3 className="font-extrabold text-xl sm:text-2xl text-white mb-3 line-clamp-1">
                {currentDeal.name}
              </h3>

              {/* Price & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-700/60">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-white">
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
                  className="relative z-30 px-7 py-3 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 hover:shadow-emerald-600/50 transition-all duration-200 cursor-pointer pointer-events-auto shrink-0"
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
