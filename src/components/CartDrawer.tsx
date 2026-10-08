"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 max-w-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-emerald-500/20 flex items-center justify-between bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Your Procurement Cart</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{cart.length} item{cart.length === 1 ? "" : "s"} selected</span>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/70">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#151838] shadow-sm mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-[#151838] text-lg mb-1">Your cart is empty</h4>
                  <p className="text-slate-500 text-sm max-w-xs mb-6">
                    Explore our industrial catalog and add parts, gear, and supplies to your procurement order.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold text-xs rounded-xl transition shadow-md shadow-emerald-700/20 cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition shadow-xs"
                  >
                    <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0 p-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-[#151838] text-sm line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-600 transition ml-2 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="inline-block text-[11px] font-bold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider mt-1 border border-emerald-100">
                          {item.product.category.replace("-", " ")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-black text-[#151838]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-black text-[#151838] text-sm">
                          PKR {(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 bg-white space-y-4 shadow-lg">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Estimated GST (18%)</span>
                    <span className="text-xs text-slate-400">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#151838] pt-2.5 border-t border-slate-100">
                    <span>Estimated Total</span>
                    <span className="text-[#059669] font-black text-lg">PKR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/25 hover:shadow-lg transition duration-200 cursor-pointer"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full inline-flex items-center justify-center py-3 px-4 bg-[#151838] hover:bg-[#1f2452] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition duration-200 cursor-pointer border border-[#1e2352]"
                  >
                    Request B2B RFQ
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
