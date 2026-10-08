"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  FileText,
  DollarSign,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { CustomerRecord, Order, Rfq } from "@/lib/db";

interface EnrichedCustomer extends CustomerRecord {
  orders?: Order[];
  rfqs?: Rfq[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<EnrichedCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<EnrichedCustomer | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openDossier = (cust: EnrichedCustomer) => {
    setSelectedCustomer(cust);
    setIsDossierOpen(true);
  };

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(term) ||
      (c.companyName && c.companyName.toLowerCase().includes(term)) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      (c.ntnNumber && c.ntnNumber.toLowerCase().includes(term)) ||
      c.city.toLowerCase().includes(term)
    );
  });

  const totalCumulativeSpend = customers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
  const enterpriseAccountsCount = customers.filter((c) => c.companyName && c.ntnNumber).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Audited Buyer Repository</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Customer Inspection & Accounts Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized repository of corporate customer accounts, lifetime purchase ledgers, and formal RFQ records.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Total Registered Buyers</p>
          <p className="text-2xl font-black text-white mt-1">{customers.length}</p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-cyan-500/20 rounded-2xl">
          <p className="text-xs text-cyan-400 font-medium">Verified Enterprise Accounts</p>
          <p className="text-2xl font-black text-cyan-300 mt-1">{enterpriseAccountsCount}</p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-emerald-500/20 rounded-2xl">
          <p className="text-xs text-emerald-400 font-medium">Cumulative Lifetime Spend</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">
            Rs. {totalCumulativeSpend.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by company name, NTN, contact person, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Customer Directory Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Customer / Company</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading customer accounts ledger...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No customer accounts found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{cust.fullName}</span>
                        {cust.ntnNumber && (
                          <span title="Verified Corporate NTN">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {cust.companyName || "Individual Procurement"}
                      </div>
                      {cust.ntnNumber && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-cyan-400 font-mono">
                          NTN: {cust.ntnNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cust.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{cust.city}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {cust.address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-white">
                        {cust.totalOrders}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        Rs. {(cust.totalSpend || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDossier(cust)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Inspect Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Dossier Inspection Modal */}
      {isDossierOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    {selectedCustomer.companyName || selectedCustomer.fullName} — Corporate Dossier
                  </h2>
                  <p className="text-xs text-slate-400">
                    Account: {selectedCustomer.fullName} | Email: {selectedCustomer.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDossierOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Account Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Tax NTN Number</span>
                  <span className="font-mono text-cyan-400 font-bold block mt-0.5">
                    {selectedCustomer.ntnNumber || "Unregistered"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Registered Phone</span>
                  <span className="text-slate-200 block mt-0.5">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Destination City</span>
                  <span className="text-slate-200 block mt-0.5">{selectedCustomer.city}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Lifetime Total Spend</span>
                  <span className="font-mono text-emerald-400 font-bold block mt-0.5">
                    Rs. {(selectedCustomer.totalSpend || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Purchase History Ledger */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Order Purchase History ({selectedCustomer.orders?.length || 0})</span>
                </h3>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">Order #</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Items</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Amount (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {selectedCustomer.orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-900/40">
                            <td className="py-2.5 px-3 font-mono font-bold text-white">
                              {o.orderNumber}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {o.items.length} item(s)
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-white">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                              Rs. {o.totalAmount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-900/30 rounded-xl">
                    No direct storefront orders registered for this account yet.
                  </p>
                )}
              </div>

              {/* Corporate RFQ Records */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Corporate RFQs & Quote Records ({selectedCustomer.rfqs?.length || 0})</span>
                </h3>
                {selectedCustomer.rfqs && selectedCustomer.rfqs.length > 0 ? (
                  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">RFQ Ref #</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Offered Quote (Rs.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {selectedCustomer.rfqs.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-900/40">
                            <td className="py-2.5 px-3 font-mono font-bold text-white">
                              {r.rfqNumber}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                                {r.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                              Rs. {(r.totalOffered || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-900/30 rounded-xl">
                    No corporate RFQ requests registered for this account.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDossierOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
