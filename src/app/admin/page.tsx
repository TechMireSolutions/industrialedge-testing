"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Server,
  DollarSign,
} from "lucide-react";
import { Order, Inquiry } from "@/lib/db";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  newInquiries: number;
  totalInquiries: number;
  outOfStockCount: number;
  activeDeals: number;
  recentOrders: Order[];
  recentInquiries: Inquiry[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case "Confirmed":
      case "Processing":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case "Dispatched":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "Delivered":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "Cancelled":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            System Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Master Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Live business control panel for Industrial Edge procurement operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh Data</span>
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-[#111538] to-[#0f172a] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition duration-500" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Orders Value</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            PKR {(stats?.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Total Logged B2B Sales</span>
          </div>
        </div>

        {/* Orders Placed */}
        <div className="bg-gradient-to-br from-[#111538] to-[#0f172a] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition duration-500" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalOrders || 0}
          </div>
          <div className="flex items-center gap-2 text-xs mt-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 text-[11px]">
              {stats?.pendingOrders || 0} Pending
            </span>
            <span className="text-slate-400">Needs processing</span>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-gradient-to-br from-[#111538] to-[#0f172a] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition duration-500" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalog Products</span>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalProducts || 0}
          </div>
          <div className="flex items-center gap-2 text-xs mt-2">
            {stats && stats.outOfStockCount > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-bold border border-red-500/30 text-[11px]">
                {stats.outOfStockCount} Out of Stock
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Items In Stock
              </span>
            )}
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-gradient-to-br from-[#111538] to-[#0f172a] p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition duration-500" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Customer Inquiries</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalInquiries || 0}
          </div>
          <div className="flex items-center gap-2 text-xs mt-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
              {stats?.newInquiries || 0} New Unread
            </span>
            <span className="text-slate-400">Received from contact form</span>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-400/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition">
                Manage Products & Stock
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Add, edit pricing, images & inventory</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
        </Link>

        <Link
          href="/admin/orders"
          className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-400/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition">
                Process Orders & Invoices
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Change statuses, view B2B buyer details</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
        </Link>

        <Link
          href="/admin/deals"
          className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                Hero Slider & Deals
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Control live homepage banners</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition" />
        </Link>
      </div>

      {/* Two Column Grid: Recent Orders & Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-[#0f1424] rounded-2xl border border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-white">Recent Customer Orders</h3>
              <p className="text-xs text-slate-400">Incoming B2B purchases from the checkout</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer / Company</th>
                    <th className="pb-3">Items</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition">
                      <td className="py-3 font-mono font-bold text-emerald-400">{order.orderNumber}</td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{order.contactPerson}</div>
                        <div className="text-[11px] text-slate-400">{order.companyName || order.city}</div>
                      </td>
                      <td className="py-3 text-slate-300">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="py-3 font-bold text-white">
                        PKR {order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              No orders logged yet. Orders placed on the checkout will show up here live!
            </div>
          )}
        </div>

        {/* Recent Inquiries (4 cols) */}
        <div className="lg:col-span-4 bg-[#0f1424] rounded-2xl border border-white/10 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-white">Recent Inquiries</h3>
              <p className="text-xs text-slate-400">Contact form submissions</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {stats.recentInquiries.map((inq) => (
                <div key={inq.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{inq.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      inq.status === "New" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-700/50 text-slate-300 border-slate-600"
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{inq.email}</div>
                  <p className="text-slate-300 line-clamp-2 text-[11px] mt-1 italic">&ldquo;{inq.message}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              No customer inquiries yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
