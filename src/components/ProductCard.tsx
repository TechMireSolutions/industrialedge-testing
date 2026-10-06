"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye, Check, Heart, ShieldCheck, Truck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Spring animation variants from Reveal Card
  const containerVariants = {
    rest: { 
      scale: 1, 
      y: 0 
    },
    hover: shouldReduceMotion ? {} : { 
      scale: 1.025, 
      y: -6,
      transition: { 
        type: "spring" as const, 
        stiffness: 320, 
        damping: 26, 
        mass: 0.8 
      }
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: shouldReduceMotion ? {} : { 
      scale: 1.08,
      transition: { type: "spring" as const, stiffness: 280, damping: 24 }
    },
  };

  const overlayVariants = {
    rest: { 
      y: "100%", 
      opacity: 0,
    },
    hover: { 
      y: "0%", 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 380,
        damping: 30,
        mass: 0.6,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const contentVariants = {
    rest: { 
      opacity: 0, 
      y: 16,
      scale: 0.96,
    },
    hover: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 380,
        damping: 26,
      },
    },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className="relative rounded-2xl border border-gray-200/80 bg-white shadow-xs hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-slate-50/80 overflow-hidden p-6 flex items-center justify-center">
        {/* Discount / New Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-md shadow-xs uppercase tracking-wider">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-md shadow-xs uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer ${
            isFavorite
              ? "bg-red-50 border-red-200 text-red-600 scale-105"
              : "bg-white/80 border-gray-200/80 text-slate-400 hover:text-red-500 hover:bg-white"
          }`}
          aria-label="Save to favorites"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Product Image with Spring Zoom */}
        <motion.div variants={imageVariants} className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Normal Card Base Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="capitalize font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
              {product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition mb-1.5">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Primary CTA */}
        <div>
          <div className="flex items-baseline gap-2 mb-3.5">
            <span className="text-lg font-black text-slate-900">
              PKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-gray-500 ml-auto font-medium">
              /{product.unit}
            </span>
          </div>

          {/* Regular Add Button (visible when not hovered on mobile or desktop) */}
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer ${
              added
                ? "bg-emerald-600 text-white shadow-emerald-500/25"
                : "bg-slate-900 hover:bg-blue-600 text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 animate-bounce" /> Added to Order
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Order
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reveal Overlay on Hover (Smooth Spring Bottom-Up reveal with Backdrop Blur) */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-white/98 backdrop-blur-md flex flex-col justify-end p-5 z-20 pointer-events-none group-hover:pointer-events-auto"
      >
        <div className="space-y-3.5">
          {/* Product Details Header */}
          <motion.div variants={contentVariants}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Quick Specs
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
              {product.name}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          {/* Spec Features Grid */}
          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">100% Genuine</div>
                  <div className="text-[10px] text-slate-500">Verified OEM</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">Fast Dispatch</div>
                  <div className="text-[10px] text-slate-500">Nationwide</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing in Overlay */}
          <motion.div variants={contentVariants} className="pt-1 flex items-baseline justify-between border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">B2B Wholesale Rate</span>
              <span className="text-base font-black text-slate-900">
                PKR {product.price.toLocaleString()}
              </span>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Per {product.unit}
            </span>
          </motion.div>

          {/* Action Buttons inside Reveal Overlay */}
          <motion.div variants={contentVariants} className="space-y-2 pt-1">
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleAdd}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-200 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white shadow-emerald-500/30"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" /> Added to Order!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Order
                </>
              )}
            </motion.button>

            <Link
              href={`/products/${product.slug}`}
              className="w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" /> View Full Specifications
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
