"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  X,
  ExternalLink,
} from "lucide-react";
import { Inquiry } from "@/lib/db";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/inquiries");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: Inquiry["status"], replyNotes?: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, replyNotes }),
      });

      if (res.ok) {
        const data = await res.json();
        setInquiries(inquiries.map((i) => (i.id === id ? data.inquiry : i)));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(data.inquiry);
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer inquiry?")) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries(inquiries.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err) {
      console.error("Delete inquiry error:", err);
    }
  };

  const openInquiryModal = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setNotesInput(inq.replyNotes || "");
    // Auto mark as Read if New
    if (inq.status === "New") {
      handleUpdateStatus(inq.id, "Read");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    await handleUpdateStatus(selectedInquiry.id, selectedInquiry.status, notesInput);
    setSavingNotes(false);
  };

  const filtered = inquiries.filter((i) => {
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    const matchesSearch =
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.company && i.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      i.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Communication & Leads
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Contact Form Inquiries
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Review and respond to client messages submitted via the contact page.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
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
            placeholder="Search by client name, email, or message..."
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
            <option value="all">All Inquiries ({inquiries.length})</option>
            <option value="New">New Unread</option>
            <option value="Read">Read / Under Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#0f1424] rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
            Loading contact inquiries...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            No customer inquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Subject / Service</th>
                  <th className="py-3.5 px-4">Message Snippet</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => openInquiryModal(inq)}
                    className="hover:bg-white/[0.03] transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {inq.status === "New" && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <span>{inq.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{inq.company || inq.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {inq.service || "General Inquiry"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">
                      {inq.message}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          inq.status === "New"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : inq.status === "Resolved"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#111538] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Lead & Inquiry Details
                </span>
                <h3 className="text-xl font-black text-white">{selectedInquiry.name}</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Meta Box */}
            <div className="bg-[#0a0e1c] p-4.5 rounded-2xl border border-white/5 space-y-2 text-xs">
              {selectedInquiry.company && (
                <p className="text-slate-300">
                  <strong>Company:</strong> {selectedInquiry.company}
                </p>
              )}
              <p className="text-slate-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedInquiry.email}</span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-emerald-400 hover:underline font-bold ml-1 text-[11px]"
                >
                  Send Email ↗
                </a>
              </p>
              {selectedInquiry.phone && (
                <p className="text-slate-300 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedInquiry.phone}</span>
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline font-bold ml-1 text-[11px]"
                  >
                    Open WhatsApp ↗
                  </a>
                </p>
              )}
              <p className="text-slate-400 text-[11px]">
                Received on: {new Date(selectedInquiry.createdAt).toLocaleString("en-PK")}
              </p>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Customer Message
              </label>
              <div className="p-4 rounded-2xl bg-[#0a0e1c] border border-white/5 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Internal Notes / Followup */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Internal Staff Notes & Followup Logs
              </label>
              <textarea
                rows={2}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Log internal notes (e.g. Called client, quotation sent on WhatsApp)..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="mt-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-[11px] font-semibold cursor-pointer"
              >
                {savingNotes ? "Saving..." : "Save Internal Note"}
              </button>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Mark Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value as Inquiry["status"])}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border bg-slate-900 text-white border-slate-700 cursor-pointer"
                >
                  <option value="New">New Unread</option>
                  <option value="Read">Read / Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
