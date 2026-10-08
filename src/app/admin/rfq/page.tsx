"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Download,
  Edit3,
  Trash2,
  X,
  Building2,
  Calendar,
  DollarSign,
  Printer,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Rfq, RfqItem } from "@/lib/db";

export default function AdminRfqPage() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRfq, setSelectedRfq] = useState<Rfq | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Quote Form State
  const [quoteForm, setQuoteForm] = useState<{
    status: Rfq["status"];
    items: RfqItem[];
    notes: string;
    subtotalOffered: number;
    gstAmount: number;
    totalOffered: number;
  }>({
    status: "Under Review",
    items: [],
    notes: "",
    subtotalOffered: 0,
    gstAmount: 0,
    totalOffered: 0,
  });

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/rfq");
      if (res.ok) {
        const data = await res.json();
        setRfqs(data.rfqs || []);
      }
    } catch (err) {
      console.error("Failed to load RFQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const openQuoteModal = (rfq: Rfq) => {
    setSelectedRfq(rfq);
    const initialItems = rfq.items.map((item) => ({
      ...item,
      quotedUnitPrice: item.quotedUnitPrice || item.targetBudget || 0,
      quotedSubtotal:
        item.quotedSubtotal ||
        (item.quotedUnitPrice || item.targetBudget || 0) * item.quantity,
    }));

    const subtotal = initialItems.reduce(
      (sum, it) => sum + (it.quotedSubtotal || 0),
      0
    );
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    setQuoteForm({
      status: rfq.status,
      items: initialItems,
      notes: rfq.notes || "",
      subtotalOffered: subtotal,
      gstAmount: gst,
      totalOffered: total,
    });

    setIsModalOpen(true);
  };

  const handleItemPriceChange = (index: number, newPrice: number) => {
    const updatedItems = [...quoteForm.items];
    const qty = updatedItems[index].quantity || 1;
    const sub = Math.round(newPrice * qty);

    updatedItems[index] = {
      ...updatedItems[index],
      quotedUnitPrice: newPrice,
      quotedSubtotal: sub,
    };

    const subtotal = updatedItems.reduce(
      (sum, it) => sum + (it.quotedSubtotal || 0),
      0
    );
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + gst;

    setQuoteForm({
      ...quoteForm,
      items: updatedItems,
      subtotalOffered: subtotal,
      gstAmount: gst,
      totalOffered: total,
    });
  };

  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/rfq/${selectedRfq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: quoteForm.status,
          items: quoteForm.items,
          notes: quoteForm.notes,
          subtotalOffered: quoteForm.subtotalOffered,
          gstAmount: quoteForm.gstAmount,
          totalOffered: quoteForm.totalOffered,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchRfqs();
      } else {
        alert("Failed to update quote adjustments");
      }
    } catch (err) {
      console.error("Save RFQ error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRfq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this RFQ record?")) return;
    try {
      const res = await fetch(`/api/admin/rfq/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRfqs(rfqs.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Delete RFQ error:", err);
    }
  };

  const handlePrintQuotation = () => {
    window.print();
  };

  const filteredRfqs = rfqs.filter((r) => {
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesSearch =
      r.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Rfq["status"]) => {
    switch (status) {
      case "Submitted":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Under Review":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Quoted":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  // Metrics
  const totalValueQuoted = rfqs.reduce(
    (sum, r) => sum + (r.totalOffered || 0),
    0
  );
  const pendingCount = rfqs.filter(
    (r) => r.status === "Submitted" || r.status === "Under Review"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Corporate B2B Procurement</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Corporate RFQ Workflow Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review corporate quote requests, negotiate custom item pricing, and issue official corporate quotations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Total RFQs Received</p>
          <p className="text-2xl font-black text-white mt-1">{rfqs.length}</p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-amber-500/20 rounded-2xl">
          <p className="text-xs text-amber-400 font-medium">Pending Review</p>
          <p className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-emerald-500/20 rounded-2xl">
          <p className="text-xs text-emerald-400 font-medium">Quoted Pipeline Value</p>
          <p className="text-2xl font-black text-emerald-300 mt-1">
            Rs. {totalValueQuoted.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400 font-medium">Standard GST Applied</p>
          <p className="text-2xl font-black text-cyan-300 mt-1">18.00%</p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by company, RFQ #, email, or contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["All", "Submitted", "Under Review", "Quoted", "Approved", "Rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* RFQ Directory Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">RFQ Ref #</th>
                <th className="py-3.5 px-4">Corporate Client</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Items / Qty</th>
                <th className="py-3.5 px-4">Quoted Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading corporate RFQ records...
                  </td>
                </tr>
              ) : filteredRfqs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No RFQ inquiries found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {rfq.rfqNumber}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{rfq.companyName}</div>
                      {rfq.ntnNumber && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-400 font-mono">
                          NTN: {rfq.ntnNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{rfq.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{rfq.email}</div>
                      <div className="text-[11px] text-slate-500">{rfq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">
                        {rfq.items.length} line item(s)
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate max-w-[180px]">
                        {rfq.items.map((i) => i.name).join(", ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-400 font-mono">
                        Rs. {(rfq.totalOffered || 0).toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        Incl. 18% GST
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          rfq.status
                        )}`}
                      >
                        {rfq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openQuoteModal(rfq)}
                          className="px-2.5 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Quote</span>
                        </button>
                        <button
                          onClick={() => handleDeleteRfq(rfq.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete RFQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Quotation Negotiation Modal */}
      {isModalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white">
                    Corporate Quotation Studio — {selectedRfq.rfqNumber}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Client: {selectedRfq.companyName} | NTN: {selectedRfq.ntnNumber || "Standard"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintQuotation}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Quotation</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveQuote} className="p-6 space-y-6">
              {/* Delivery & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Delivery Destination</span>
                  <span className="text-xs text-white font-medium block mt-0.5">
                    {selectedRfq.deliveryLocation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Contact Person</span>
                  <span className="text-xs text-white font-medium block mt-0.5">
                    {selectedRfq.contactPerson} ({selectedRfq.phone})
                  </span>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Quotation Workflow Status
                  </label>
                  <select
                    value={quoteForm.status}
                    onChange={(e) =>
                      setQuoteForm({
                        ...quoteForm,
                        status: e.target.value as Rfq["status"],
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="Submitted">Submitted (Pending Review)</option>
                    <option value="Under Review">Under Review (Pricing in progress)</option>
                    <option value="Quoted">Quoted (Official Quote Issued)</option>
                    <option value="Approved">Approved (Corporate PO Accepted)</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Line Items Negotiation Table */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                  Line Items & Corporate Price Adjustments
                </h3>
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3">SKU</th>
                        <th className="py-2.5 px-3">Qty / Unit</th>
                        <th className="py-2.5 px-3">Target Budget</th>
                        <th className="py-2.5 px-3">Quoted Unit Price (Rs.)</th>
                        <th className="py-2.5 px-3 text-right">Subtotal (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {quoteForm.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 text-white font-medium">
                            {item.name}
                            {item.notes && (
                              <span className="block text-[10px] text-slate-400 italic">
                                Note: {item.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                            {item.sku || "N/A"}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-white">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 font-mono">
                            {item.targetBudget
                              ? `Rs. ${item.targetBudget.toLocaleString()}`
                              : "Open"}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              value={item.quotedUnitPrice || 0}
                              onChange={(e) =>
                                handleItemPriceChange(idx, Number(e.target.value))
                              }
                              className="w-32 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                            Rs. {(item.quotedSubtotal || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="w-full sm:w-1/2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Special Quotation Terms & Dispatch Disclaimers
                  </label>
                  <textarea
                    rows={3}
                    value={quoteForm.notes}
                    onChange={(e) =>
                      setQuoteForm({ ...quoteForm, notes: e.target.value })
                    }
                    placeholder="Quotation validity: 15 days. Payment terms: Corporate PO with Net 30. Delivery to site included."
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="w-full sm:w-80 p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Offered Net Subtotal:</span>
                    <span className="font-mono text-white">
                      Rs. {quoteForm.subtotalOffered.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>FBR Sales Tax / GST (18%):</span>
                    <span className="font-mono text-cyan-400">
                      Rs. {quoteForm.gstAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-white">Gross Total Offered:</span>
                    <span className="font-mono text-emerald-400">
                      Rs. {quoteForm.totalOffered.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save & Issue Quote"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
