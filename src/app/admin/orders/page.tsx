"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCw,
  Building2,
  Truck,
  CreditCard,
  X,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Order } from "@/lib/db";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map((o) => (o.id === orderId ? updated.order : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated.order);
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to permanently delete this order record?")) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (err) {
      console.error("Delete order error:", err);
    }
  };

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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.companyName && o.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Sales & Orders
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Customer Orders & B2B Leads
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage checkout orders, change delivery status, and review client procurement requirements.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#0f1424] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by order #, buyer, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0f1424] rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
            Loading orders from Node backend...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            No customer orders logged in this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer / Business</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.03] transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{order.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{order.companyName || order.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{order.city}</td>
                    <td className="py-3.5 px-4 font-black text-white">
                      PKR {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order["status"])}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-md border bg-slate-900 cursor-pointer focus:outline-none ${getStatusBadge(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-400/20 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#111538] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Procurement Order Invoice
                </span>
                <h3 className="text-xl font-black text-white font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buyer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0a0e1c] p-4.5 rounded-2xl border border-white/5 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Client Information</span>
                <p className="text-white font-bold">{selectedOrder.contactPerson}</p>
                {selectedOrder.companyName && <p className="text-slate-300">🏢 {selectedOrder.companyName}</p>}
                {selectedOrder.ntnNumber && <p className="text-slate-400">NTN / STRN: {selectedOrder.ntnNumber}</p>}
                <p className="text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" /> {selectedOrder.email}
                </p>
                <p className="text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {selectedOrder.phone}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Logistics & Settlement</span>
                <p className="text-slate-300 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.deliveryAddress}, {selectedOrder.city}</span>
                </p>
                <p className="text-slate-300">
                  <strong>Payment Term:</strong> {selectedOrder.paymentMethod}
                </p>
                {selectedOrder.poNumber && (
                  <p className="text-slate-300">
                    <strong>Internal PO:</strong> {selectedOrder.poNumber}
                  </p>
                )}
                {selectedOrder.notes && (
                  <p className="text-slate-400 italic bg-white/5 p-2 rounded-lg mt-1">
                    &ldquo;{selectedOrder.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Purchased Items Table */}
            <div>
              <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-2.5">
                Items In Order ({selectedOrder.items?.length || 0})
              </h4>
              <div className="bg-[#0a0e1c] rounded-2xl border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-white line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            PKR {item.price.toLocaleString()} × {item.quantity} {item.unit}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-white shrink-0 ml-3">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-white/[0.02] border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-white font-semibold">PKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST Tax (18%):</span>
                    <span className="text-white font-semibold">PKR {selectedOrder.gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                    <span>Grand Total:</span>
                    <span className="text-emerald-400">PKR {selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400">Order Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order["status"])}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border bg-slate-900 cursor-pointer ${getStatusBadge(selectedOrder.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
