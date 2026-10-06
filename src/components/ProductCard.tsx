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
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -7, transition: { duration: 0.25 } }}
      className="bg-white rounded-2xl border border-gray-100/90 shadow-xs hover:shadow-2xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
    >
      {/* Image Container with Subtle Ambient Glow on Hover */}
      <div className="relative aspect-4/3 bg-slate-50/70 overflow-hidden p-6 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && (
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-md shadow-xs uppercase tracking-wider"
            >
              NEW
            </motion.span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-[11px] font-bold rounded-md shadow-xs uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500 ease-out">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Quick View Button Animated Overlay */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 bg-slate-950/15 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
        >
          <motion.span 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/95 text-slate-900 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" /> View Details
          </motion.span>
        </Link>
      </div>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2.5">
            <span className="capitalize font-semibold text-blue-600 bg-blue-50/80 px-2.5 py-0.5 rounded-full text-[11px] border border-blue-100/50">
              {product.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition duration-150 mb-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
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

          {/* Add to Cart button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-xs cursor-pointer ${
              added
                ? "bg-emerald-600 text-white shadow-emerald-500/25"
                : "bg-slate-900 hover:bg-blue-600 text-white hover:shadow-blue-500/25 hover:shadow-md"
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
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
