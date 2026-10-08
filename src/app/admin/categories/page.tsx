"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Wrench,
  Cpu,
  Briefcase,
  HardHat,
  FlaskConical,
  Zap,
  Box,
  Tag,
  ShieldCheck,
  Settings,
  HelpCircle,
} from "lucide-react";
import { CategoryItem } from "@/lib/db";

// Map icon string name to Lucide component
const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Cpu,
  Briefcase,
  HardHat,
  FlaskConical,
  Zap,
  Box,
  Tag,
  ShieldCheck,
  Settings,
  Package,
  Layers,
  Sparkles,
  FolderTree,
};

const AVAILABLE_ICONS = [
  { name: "Wrench", label: "Tools / Hardware" },
  { name: "Cpu", label: "Electronics / IT" },
  { name: "Briefcase", label: "Office / Business" },
  { name: "HardHat", label: "Safety PPE" },
  { name: "FlaskConical", label: "Chemicals / Oils" },
  { name: "Zap", label: "Electrical / Energy" },
  { name: "Box", label: "Logistics / Storage" },
  { name: "Package", label: "General Products" },
  { name: "Layers", label: "Materials / Layers" },
  { name: "ShieldCheck", label: "Security / Standards" },
  { name: "FolderTree", label: "Classification" },
  { name: "Sparkles", label: "Premium / Special" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteModalCategory, setDeleteModalCategory] = useState<CategoryItem | null>(null);
  const [forceDelete, setForceDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Category Form State
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "FolderTree",
    description: "",
    subcategoriesInput: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      icon: "FolderTree",
      description: "",
      subcategoriesInput: "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "FolderTree",
      description: cat.description || "",
      subcategoriesInput: (cat.subcategories || []).join(", "),
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    // Auto generate slug if creating or if slug matches old slugified name
    if (!editingCategory) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setForm((prev) => ({ ...prev, name, slug: generatedSlug }));
    } else {
      setForm((prev) => ({ ...prev, name }));
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const subcategories = form.subcategoriesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        icon: form.icon,
        description: form.description.trim(),
        subcategories,
      };

      const url = "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory ? { ...payload, id: editingCategory.id } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setActionSuccess(
        editingCategory
          ? `Category '${form.name}' updated successfully!`
          : `New category '${form.name}' created successfully!`
      );
      setTimeout(() => setActionSuccess(null), 4000);
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteModalCategory) return;

    setDeleting(true);
    setErrorMessage(null);

    try {
      const url = `/api/admin/categories?id=${encodeURIComponent(deleteModalCategory.id)}${
        forceDelete ? "&force=true" : ""
      }`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setActionSuccess(`Category '${deleteModalCategory.name}' deleted successfully.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setDeleteModalCategory(null);
      setForceDelete(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
  const totalSubcategories = categories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Catalog & Taxonomy Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Product Category Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Create, update, and delete catalog categories, subcategories, Lucide icons, and dynamic SEO slugs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchCategories}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Refresh Categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0f1424] border border-white/10 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Categories
            </span>
            <span className="text-xl font-black text-white">{categories.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1424] border border-white/10 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Categorized Products
            </span>
            <span className="text-xl font-black text-white">{totalProducts}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0f1424] border border-white/10 flex items-center gap-3.5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Subcategory Tags
            </span>
            <span className="text-xl font-black text-white">{totalSubcategories}</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || FolderTree;
          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-[#0f1424] border border-white/10 hover:border-emerald-500/40 transition-all duration-200 shadow-xl flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        /{cat.slug}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-emerald-400">
                    {cat.productCount ?? 0} Products
                  </span>
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}

                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                      Subcategories ({cat.subcategories.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <Link
                  href={`/admin/products`}
                  className="text-[11px] font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View Products</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 border border-white/10 transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModalCategory(cat);
                      setForceDelete(false);
                      setErrorMessage(null);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && !loading && (
          <div className="col-span-full py-16 text-center text-slate-500 bg-[#0f1424] rounded-3xl border border-white/5">
            <FolderTree className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-400">No categories found matching criteria.</p>
            <p className="text-xs text-slate-600 mt-1">Try another search term or click &quot;Add New Category&quot;.</p>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1424] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-emerald-400" />
                <span>{editingCategory ? "Edit Category" : "Add New Category"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Pneumatics & Valves"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    URL Slug *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    /category/{form.slug || "slug"}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="pneumatics-valves"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Lucide Display Icon
                </label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic.name} value={ic.name}>
                      {ic.label} ({ic.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary of products and applications in this category..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Subcategories (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.subcategoriesInput}
                  onChange={(e) => setForm({ ...form, subcategoriesInput: e.target.value })}
                  placeholder="e.g. Solenoid Valves, Air Filters, Pressure Gauges"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Separate multiple subcategories with commas.</p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl shadow-lg shadow-emerald-900/30 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteModalCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1424] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400 border-b border-white/10 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Delete Category</h3>
                <p className="text-[11px] text-slate-400">Confirm catalog taxonomy removal</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Are you sure you want to delete category{" "}
                <span className="font-bold text-white">&quot;{deleteModalCategory.name}&quot;</span>?
              </p>

              {(deleteModalCategory.productCount ?? 0) > 0 ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                  <p className="font-bold text-amber-300">
                    ⚠️ {deleteModalCategory.productCount} product(s) are currently assigned to this category!
                  </p>
                  <p className="text-[11px] text-amber-400/90 leading-relaxed">
                    By checking Force Delete below, all linked products will be automatically reassigned to the default catalog fallback so no products are lost.
                  </p>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white pt-1">
                    <input
                      type="checkbox"
                      checked={forceDelete}
                      onChange={(e) => setForceDelete(e.target.checked)}
                      className="rounded text-rose-500"
                    />
                    <span>Force delete and reassign products</span>
                  </label>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  This category has 0 assigned products and can be deleted safely.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteModalCategory(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={deleting || ((deleteModalCategory.productCount ?? 0) > 0 && !forceDelete)}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-900/30 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
