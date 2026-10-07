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
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#eef3fb] via-[#ffffff] via-45% to-[#e8f8f2] backdrop-blur-md shadow-xs border-b border-slate-200/80">
      {/* Top Banner (Full Screen Width) */}
      <div className="bg-[#111538] text-slate-300 text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800">
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
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group py-1">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <Image
                src="/logo-icon.webp"
                alt="Industrial Edge Logo"
                fill
                className="object-contain transform group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-logo text-[19px] font-bold tracking-tight text-[#151838] leading-tight">
                Industrial Edge
              </span>
              <span className="font-logo text-[10.5px] font-semibold text-[#059669] tracking-wider leading-tight mt-0.5">
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
                className="w-full pl-10 pr-4 py-2 text-xs bg-white/90 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#059669] rounded-full shadow-2xs focus:outline-none transition duration-150"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
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
                        ? "text-[#059669] font-bold"
                        : "text-slate-700 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Top & Bottom Border Animation (Logo Teal & Navy) */}
                  <span
                    className={`absolute inset-0 border-t-2 border-b-2 border-[#059669] pointer-events-none transition-all duration-300 origin-center ${
                      isActive
                        ? "scale-y-100 opacity-100"
                        : "transform scale-y-[2] opacity-0 group-hover:scale-y-100 group-hover:opacity-100"
                    }`}
                  />

                  {/* Background Fill Animation (Gradient from Deep Navy to Teal) */}
                  <span
                    className={`absolute inset-0 bg-gradient-to-r from-[#151838] to-[#059669] pointer-events-none transition-all duration-300 origin-top ${
                      isActive
                        ? "scale-100 opacity-10 bg-emerald-50"
                        : "transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions: Cart Trigger */}
          <div className="flex items-center gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-[#059669] transition flex items-center gap-2 border border-slate-200/90 hover:border-emerald-300 cursor-pointer shadow-2xs"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-bold text-xs">Cart</span>
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#151838] to-[#059669] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button with morphing bars animation */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                <div className={`animated-hamburger ${isOpen ? "is-open" : ""}`}>
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
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
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Subtle Bottom Accent Gradient Line (Navy to Emerald) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#151838] via-[#1e428a] to-[#059669]" />

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-gradient-to-b from-white to-[#f0fdf4] border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-slate-700 hover:text-[#059669] py-1"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full px-4 py-2.5 font-bold text-white bg-gradient-to-r from-[#151838] to-[#059669] rounded-xl shadow-xs"
            >
              Request B2B Quotation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
