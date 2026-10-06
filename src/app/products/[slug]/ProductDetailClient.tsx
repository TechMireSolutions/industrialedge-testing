"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  FileText, 
  Check, 
  Plus, 
  Minus,
  Building2
} from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

interface Props {
  product: Product;
  relatedProducts: Product[];
}

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
    <div className="space-y-16">
      {/* Product Overview Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square max-w-md bg-slate-50 rounded-2xl p-8 border border-slate-100 flex items-center justify-center">
            {product.isNew && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm">
                NEW RELEASE
              </span>
            )}
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-6"
              priority
            />
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            * 100% Genuine manufacturer packaging & certified serial trackable
          </p>
        </div>

        {/* Right: Purchasing Info */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full capitalize">
                {product.category.replace("-", " ")}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-baseline gap-4">
              <div>
                <span className="text-xs text-gray-500 block mb-0.5">Wholesale Unit Price</span>
                <span className="text-3xl font-black text-slate-900">
                  PKR {product.price.toLocaleString()}
                </span>
              </div>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-md ml-auto">
                Per {product.unit}
              </span>
            </div>

            {/* Minimum Order Indicator */}
            {product.minOrderQty > 1 && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-xl mb-6 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>B2B Bulk Minimum Order:</strong> {product.minOrderQty} {product.unit}s required for corporate fulfillment.
                </span>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                    className="p-2.5 hover:bg-slate-50 text-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-black text-slate-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-slate-50 text-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Subtotal: <strong className="text-slate-900 font-bold">PKR {(product.price * quantity).toLocaleString()}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`cart-animated-btn w-full h-12 px-6 rounded-xl font-bold text-sm shadow-md transition-all duration-300 cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white shadow-emerald-500/25"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/30"
                  }`}
                >
                  {added ? (
                    <span className="flex items-center justify-center gap-2 w-full h-full">
                      <Check className="w-5 h-5 animate-bounce" /> Added to Cart!
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
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-xs transition"
                >
                  Request B2B RFQ
                </Link>
              </div>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[11px] font-bold text-gray-800">Nationwide Logistics</span>
              <span className="text-[10px] text-gray-500">2-4 Business Days</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-[11px] font-bold text-gray-800">100% Authentic</span>
              <span className="text-[10px] text-gray-500">Verified Certifications</span>
            </div>
            <div className="flex flex-col items-center">
              <FileText className="w-5 h-5 text-purple-600 mb-1" />
              <span className="text-[11px] font-bold text-gray-800">Tax Invoicing</span>
              <span className="text-[10px] text-gray-500">FBR GST Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs">
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Technical Specifications
        </h3>
        <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {Object.entries(product.specifications).map(([key, value], idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white hover:bg-slate-50 text-sm">
              <span className="font-semibold text-slate-700">{key}</span>
              <span className="sm:col-span-2 text-slate-600">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-slate-900">
              Related Supplies in this Category
            </h3>
            <Link href={`/products?category=${product.category}`} className="text-xs font-bold text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
