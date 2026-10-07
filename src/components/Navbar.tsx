"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingCart, 
  Search, 
  ShieldCheck, 
  Layers, 
  User
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { totalItems, setIsCartOpen, isHydrated } = useCart();

  const navLinks = [
    { name: "Store / Products", href: "/products" },
    { name: "Categories", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Why Us", href: "/what-we-do" },
    { name: "Partners", href: "/portfolio" },
    { name: "Contact / RFQ", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] backdrop-blur-md shadow-lg border-b border-emerald-500/20 text-white">
      {/* Top Banner (Full Screen Width) */}
      <div className="bg-[#0a0d24]/90 text-slate-300 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-white/10">
        <div className="w-full px-1 sm:px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2">
          {/* Main message */}
          <div className="flex items-center justify-center sm:justify-start w-full sm:w-auto space-x-6">
            <span className="flex items-center justify-center gap-1.5 text-emerald-400 font-semibold text-[11px] sm:text-xs text-center">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Direct Industrial Sourcing & Corporate Bulk Pricing
            </span>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+92 332 2316225</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>info@industrialedge.pk</span>
            </div>
          </div>

          {/* Location & RFQ link - Clean on mobile */}
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-300">
            <span>Karachi Head Office | Nationwide Delivery</span>
            <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 font-medium shrink-0">
              Submit Corporate RFQ →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav (Full Screen Width) */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Brand Logo with Larger Icon + Same Text Size */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group py-1">
            <div className="relative w-13 h-13 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center shadow-xs">
              <Image
                src="/logo-icon.webp"
                alt="Industrial Edge Logo"
                fill
                className="object-contain p-0.5 transform group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-logo text-[19px] font-bold tracking-tight text-white leading-tight">
                Industrial Edge
              </span>
              <span className="font-logo text-[10.5px] font-medium text-emerald-400 tracking-wider leading-tight mt-0.5">
                Fulfillment Guaranteed
              </span>
            </div>
          </Link>

          {/* Search bar (Store Search) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative w-full"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, PPE, electronics, lubricants, cables..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-slate-300 border border-white/15 focus:border-emerald-400 rounded-full focus:outline-none transition duration-150"
              />
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-2.5" />
            </form>
          </div>

          {/* Desktop Navigation Links with Animated Border and Background reveal */}
          <nav className="hidden lg:flex items-center space-x-2 text-sm font-semibold">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative inline-block group px-3.5 py-1.5 overflow-hidden rounded-md transition-colors"
                >
                  {/* Link Text */}
                  <span
                    className={`relative z-10 block transition-colors duration-300 ${
                      isActive
                        ? "text-emerald-400 font-bold"
                        : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Top & Bottom Border Animation (Logo Teal & Navy) */}
                  <span
                    className={`absolute inset-0 border-t-2 border-b-2 border-emerald-400 pointer-events-none transition-all duration-300 origin-center ${
                      isActive
                        ? "scale-y-100 opacity-100"
                        : "transform scale-y-[2] opacity-0 group-hover:scale-y-100 group-hover:opacity-100"
                    }`}
                  />

                  {/* Background Fill Animation (Gradient from Deep Navy to Teal) */}
                  <span
                    className={`absolute inset-0 bg-white/10 pointer-events-none transition-all duration-300 origin-top ${
                      isActive
                        ? "scale-100 opacity-100"
                        : "transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart Trigger with Logo Gradient Accents */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-white hover:text-emerald-300 transition flex items-center gap-2 border border-white/15 hover:border-emerald-400/40 cursor-pointer shadow-xs"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-bold text-xs">Cart</span>
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button with morphing bars animation */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:text-emerald-300 focus:outline-none flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                <div className={`animated-hamburger ${isOpen ? "is-open" : ""}`}>
                  <span className="bar !bg-white" />
                  <span className="bar !bg-white" />
                  <span className="bar !bg-white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="relative w-full"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search industrial products..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white/10 border border-white/20 text-white placeholder-slate-300 rounded-lg focus:outline-none"
            />
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-[#111538] border-b border-emerald-500/20 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-slate-200 hover:text-emerald-400 py-1"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full px-4 py-2.5 font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-xs"
            >
              Request B2B Quotation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
