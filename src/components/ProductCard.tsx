"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Eye, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-slate-950/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 bg-slate-50 dark:bg-slate-800/60 overflow-hidden p-6 flex items-center justify-center">
        {/* Badges */}
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

        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Quick View Button */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 bg-slate-900/20 dark:bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="px-4 py-2 bg-white/95 dark:bg-slate-800/95 text-slate-900 dark:text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </Link>
      </div>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-2">
            <span className="capitalize font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-transparent dark:border-blue-900/40">
              {product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-gray-400 dark:text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition mb-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              PKR {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 dark:text-slate-500 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-gray-500 dark:text-slate-400 ml-auto font-medium">
              /{product.unit}
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xs ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added to Order
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Order
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
