"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  FileText, 
  Check, 
  Plus, 
  Minus,
  Building2,
  ArrowRight,
  Sparkles,
  Award
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(product.minOrderQty || 1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-12 sm:space-y-16"
    >
      {/* Product Overview Section with Strong Contrast & Smooth Animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-900/5 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12"
      >
        {/* Left: Product Image Showcase */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative w-full aspect-square max-w-md bg-gradient-to-br from-slate-50 via-white to-slate-100/90 rounded-2xl p-8 border border-slate-200/90 shadow-inner flex items-center justify-center overflow-hidden group/img"
          >
            {product.isNew && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 z-10">
                <Sparkles className="w-3 h-3" /> NEW RELEASE
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-black rounded-lg shadow-sm z-10">
                -{discountPercent}% OFF
              </span>
            )}
            <div className="relative w-full h-full transform group-hover/img:scale-105 transition-transform duration-500">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-slate-500">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Genuine manufacturer packaging & certified serial trackable</span>
          </div>
        </div>

        {/* Right: Purchasing Info with High Contrast */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 bg-[#111538] text-emerald-400 rounded-full border border-emerald-500/30 capitalize tracking-wide">
                {product.category.replace("-", " ")}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-500 font-normal">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111538] leading-tight mb-4 tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* High-Contrast Wholesale Price Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white border border-emerald-500/30 shadow-lg shadow-slate-900/10 mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  Wholesale Unit Price (Excl. Tax)
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-400/40">
                Per {product.unit}
              </span>
            </div>

            {/* Minimum Order Indicator */}
            {product.minOrderQty > 1 && (
              <div className="text-xs text-amber-900 bg-amber-50/90 border border-amber-300/80 p-3 rounded-xl mb-6 flex items-center gap-2.5 shadow-2xs">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>B2B Bulk Minimum Order:</strong> {product.minOrderQty} {product.unit}s required for corporate fulfillment pricing.
                </span>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-xs font-bold uppercase text-slate-800">Order Quantity:</span>
                <div className="flex items-center border-2 border-slate-200 rounded-xl bg-slate-50 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                    className="p-2.5 hover:bg-slate-200/80 text-slate-700 transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-black text-[#111538] text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-slate-200/80 text-slate-700 transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-slate-600">
                  Subtotal: <strong className="text-[#111538] font-black text-sm">PKR {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`cart-animated-btn w-full h-12 px-6 rounded-xl font-bold text-sm shadow-md transition-all duration-300 cursor-pointer ${
                    added
                      ? "bg-[#059669] text-white shadow-emerald-500/25"
                      : "bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white hover:shadow-emerald-600/30"
                  }`}
                >
                  {added ? (
                    <span className="flex items-center justify-center gap-2 w-full h-full">
                      <Check className="w-5 h-5 animate-bounce" /> Added to Order Cart!
                    </span>
                  ) : (
                    <>
                      {/* Default Text Track */}
                      <div className="btn-text-track flex items-center justify-center gap-2 font-bold text-sm">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Order Cart</span>
                      </div>

                      {/* Hover Slide Icon Track */}
                      <div className="btn-icon-track flex items-center justify-center text-white">
                        <ShoppingCart className="w-6 h-6 transform scale-125" />
                      </div>
                    </>
                  )}
                </button>
                <Link
                  href="/contact"
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-[#111538] hover:bg-[#1a2052] text-white flex items-center justify-center gap-2 shadow-md transition border border-slate-700/60"
                >
                  Request B2B RFQ
                </Link>
              </div>
            </div>
          </div>

          {/* Guarantees Badges with Contrast */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition">
              <div className="p-2 rounded-lg bg-blue-100/80 text-blue-700">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Nationwide Delivery</span>
                <span className="text-[10px] text-slate-500">2-4 Business Days</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition">
              <div className="p-2 rounded-lg bg-emerald-100/80 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">100% Authentic</span>
                <span className="text-[10px] text-slate-500">OEM Warranty Tracked</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition">
              <div className="p-2 rounded-lg bg-purple-100/80 text-purple-700">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">GST Tax Invoicing</span>
                <span className="text-[10px] text-slate-500">FBR Registered NTN</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Specifications Table with Brand Gradient Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-500/20">
          <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-emerald-400" /> Technical Specifications & Parameters
          </h3>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider hidden sm:inline">
            Verified Specs
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {Object.entries(product.specifications).map(([key, value], idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-1 sm:grid-cols-3 p-4 sm:p-5 text-sm transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
              } hover:bg-emerald-50/30`}
            >
              <span className="font-bold text-[#111538] sm:pr-4">{key}</span>
              <span className="sm:col-span-2 text-slate-700 font-medium mt-1 sm:mt-0">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Related Products with Staggered Fade In */}
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Explore More</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#111538] tracking-tight mt-1">
                Related Supplies in this Category
              </h3>
            </div>
            <Link 
              href={`/products?category=${product.category}`} 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:text-[#047857] hover:underline"
            >
              View Full Category <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {relatedProducts.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
