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
    <div className="bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 text-white relative shadow-xl max-w-md mx-auto lg:ml-auto overflow-hidden">
      {/* Top Tag & Slide Indicators */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-600/90 text-white text-[11px] font-bold rounded-md uppercase tracking-wider">
          <Flame className="w-3 h-3" /> Live B2B Deal
        </span>
        <div className="flex items-center gap-1.5">
          {deals.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "w-5 bg-blue-500" : "w-1.5 bg-white/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Animated Slide Content */}
      <div className="relative min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDeal.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-col justify-between h-full"
          >
            {/* Product Image */}
            <div className="relative aspect-16/10 rounded-xl bg-white/5 overflow-hidden p-4 mb-3 flex items-center justify-center">
              <Image
                src={currentDeal.image}
                alt={currentDeal.name}
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            {/* Product Title & Info */}
            <h3 className="font-bold text-base text-white mb-1.5 line-clamp-1">
              {currentDeal.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 mb-3">
              {currentDeal.description}
            </p>

            {/* Price Box */}
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-xl font-bold text-white">
                PKR {currentDeal.price.toLocaleString()}
              </span>
              {currentDeal.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  PKR {currentDeal.originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[11px] text-emerald-400 font-bold ml-auto">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={`/products/${currentDeal.slug}`}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              View Product Deal <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left/Right arrow controls */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? deals.length - 1 : prev - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white/80 hover:text-white transition backdrop-blur-xs z-10"
        aria-label="Previous Deal"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % deals.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white/80 hover:text-white transition backdrop-blur-xs z-10"
        aria-label="Next Deal"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
