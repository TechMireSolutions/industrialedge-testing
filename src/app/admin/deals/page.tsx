"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  ExternalLink,
  Flame,
} from "lucide-react";
import { HeroDeal } from "@/lib/db";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<HeroDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<HeroDeal | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badge: "Exclusive Wholesale Deal",
    price: 0,
    originalPrice: 0,
    image: "/uploads/2025/03/200.png",
    slug: "",
    active: true,
    order: 1,
  });

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/deals");
      if (res.ok) {
        const data = await res.json();
        setDeals(data);
      }
    } catch (err) {
      console.error("Failed to load deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const openAddModal = () => {
    setEditingDeal(null);
    setForm({
      title: "",
      subtitle: "",
      badge: "Exclusive Wholesale Deal",
      price: 0,
      originalPrice: 0,
      image: "/uploads/2025/03/200.png",
      slug: "",
      active: true,
      order: deals.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (d: HeroDeal) => {
    setEditingDeal(d);
    setForm({
      title: d.title,
      subtitle: d.subtitle,
      badge: d.badge,
      price: d.price,
      originalPrice: d.originalPrice,
      image: d.image,
      slug: d.slug,
      active: d.active,
      order: d.order,
    });
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingDeal
        ? `/api/admin/deals/${editingDeal.id}`
        : "/api/admin/deals";
      const method = editingDeal ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchDeals();
      } else {
        alert("Failed to save deal");
      }
    } catch (err) {
      console.error("Save deal error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (deal: HeroDeal) => {
    try {
      const updatedActive = !deal.active;
      const res = await fetch(`/api/admin/deals/${deal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: updatedActive }),
      });
      if (res.ok) {
        setDeals(
          deals.map((d) => (d.id === deal.id ? { ...d, active: updatedActive } : d))
        );
      }
    } catch (err) {
      console.error("Toggle deal error:", err);
    }
  };

  const handleDeleteDeal = async (id: string) => {
    if (!confirm("Remove this deal slide?")) return;
    try {
      const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeals(deals.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error("Delete deal error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Storefront Merchandising
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Homepage Hero Slider Deals
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Control the highlighted products and flash discounts displayed in the top homepage slider.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDeals}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hero Deal</span>
          </button>
        </div>
      </div>

      {/* Grid of Deals */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-[#0f1424] rounded-2xl border border-white/10">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto mb-3" />
          Loading hero deals...
        </div>
      ) : deals.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs bg-[#0f1424] rounded-2xl border border-white/10">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-slate-600" />
          No hero deals configured yet. Click &quot;Add Hero Deal&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const discount = deal.originalPrice
              ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
              : 0;

            return (
              <div
                key={deal.id}
                className="bg-[#0f1424] rounded-3xl border border-white/10 overflow-hidden shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image Preview */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden border-b border-white/10">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Flame className="w-3 h-3" /> {discount}% OFF
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => toggleActive(deal)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          deal.active
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {deal.active ? "● Live On Homepage" : "○ Inactive"}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {deal.badge}
                    </span>
                    <h3 className="font-black text-white text-base line-clamp-1">{deal.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{deal.subtitle}</p>

                    <div className="pt-2 flex items-baseline gap-2">
                      <span className="text-lg font-black text-white">
                        PKR {deal.price.toLocaleString()}
                      </span>
                      {deal.originalPrice > deal.price && (
                        <span className="text-xs text-slate-500 line-through">
                          PKR {deal.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Display Order: #{deal.order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(deal)}
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition cursor-pointer"
                      title="Edit Deal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDeal(deal.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                      title="Delete Deal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#111538] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full my-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white">
                {editingDeal ? "Edit Hero Deal Slide" : "Add Hero Deal Slide"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Deal Heading *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 20V Cordless Brushless Impact Drill"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Subtitle / Promo Text
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. Heavy Duty Kit with 2x 4.0Ah batteries & armored case"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Deal Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Original Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Image Path *"
                value={form.image}
                onChange={(val) => setForm({ ...form, image: val })}
                required
                placeholder="/uploads/2025/03/200.png"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Product Slug (Target Link)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="cordless-impact-drill-kit-20v"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Display Sequence #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white pt-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded text-emerald-500"
                />
                <span>Active On Live Homepage</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold hover:bg-white/15 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 transition cursor-pointer"
                >
                  {submitting ? "Saving..." : editingDeal ? "Update Slide" : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
