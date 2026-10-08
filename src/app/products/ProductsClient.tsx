"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  PRODUCTS, 
  CATEGORIES, 
  Product 
} from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { 
  Search, 
  ArrowUpDown, 
  PackageX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  initialProducts?: Product[];
}

export default function ProductsClient({ initialProducts }: Props) {
  const allProducts = initialProducts && initialProducts.length > 0 ? initialProducts : PRODUCTS;
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <div className="bg-gradient-to-b from-slate-100 via-slate-50 to-[#f8fafc] min-h-screen pb-16 selection:bg-[#059669] selection:text-white">
      {/* Brand Hero Header Banner */}
      <div className="relative bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white overflow-hidden py-12 lg:py-16 mb-8 border-b border-emerald-500/20">
        {/* Ambient brand colored glowing orbs */}
        <div className="absolute -top-12 -left-12 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              E-Commerce Store & Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Industrial Supplies & Equipment
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Order certified enterprise products with wholesale pricing, warranty backing, and nationwide dispatch across Pakistan.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12">
        {/* Filter & Search Bar with Brand Accents */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-md shadow-slate-200/50 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by title, spec, or category..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] transition-all duration-150"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-6 flex items-center justify-end gap-3">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669] cursor-pointer transition-all"
              >
                <option value="featured">Featured / Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs with Animated Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-gray-100 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-[#151838] to-[#059669] text-white shadow-md shadow-emerald-950/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> items
          </p>
        </div>

        {/* Products Grid with Layout Animation */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs"
            >
              <PackageX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg">No products found</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1 mb-6">
                We couldn&apos;t find anything matching your filters. Try clearing your search or switching categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#151838] to-[#059669] text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
