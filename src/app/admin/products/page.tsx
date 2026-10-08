"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
  Upload,
  Layers,
  Wrench,
  AlertTriangle,
  FileSpreadsheet,
  FolderTree,
} from "lucide-react";
import { Product, CATEGORIES } from "@/data/products";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { CategoryItem } from "@/lib/db";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockOnlyFilter, setStockOnlyFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Dynamic Categories State
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCatItem, setEditingCatItem] = useState<CategoryItem | null>(null);
  const [catForm, setCatForm] = useState({
    name: "",
    slug: "",
    icon: "FolderTree",
    description: "",
    subcategoriesInput: "",
  });
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catError, setCatError] = useState<string | null>(null);

  // Delete Category Modal State
  const [deleteCategoryItem, setDeleteCategoryItem] = useState<CategoryItem | null>(null);
  const [catForceDelete, setCatForceDelete] = useState(false);
  const [catDeleting, setCatDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    sku: "",
    slug: "",
    category: "hardware-tools",
    price: 0,
    originalPrice: 0,
    image: "/uploads/2025/03/200.png",
    description: "",
    inStock: true,
    isFeatured: false,
    isNew: true,
    minOrderQty: 1,
    unit: "Piece",
    stockQuantity: 25,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Category Quick Action Handlers
  const handleOpenAddCategory = () => {
    setEditingCatItem(null);
    setCatForm({
      name: "",
      slug: "",
      icon: "FolderTree",
      description: "",
      subcategoriesInput: "",
    });
    setCatError(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = () => {
    const selected = categories.find((c) => c.id === form.category || c.slug === form.category);
    if (!selected) return;
    setEditingCatItem(selected);
    setCatForm({
      name: selected.name,
      slug: selected.slug,
      icon: selected.icon || "FolderTree",
      description: selected.description || "",
      subcategoriesInput: (selected.subcategories || []).join(", "),
    });
    setCatError(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenDeleteCategory = () => {
    const selected = categories.find((c) => c.id === form.category || c.slug === form.category);
    if (!selected) return;
    setDeleteCategoryItem(selected);
    setCatForceDelete(false);
    setCatError(null);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setCatSubmitting(true);
    setCatError(null);

    try {
      const subcategories = catForm.subcategoriesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: catForm.name.trim(),
        slug: catForm.slug.trim(),
        icon: catForm.icon,
        description: catForm.description.trim(),
        subcategories,
      };

      const url = "/api/admin/categories";
      const method = editingCatItem ? "PUT" : "POST";
      const body = editingCatItem ? { ...payload, id: editingCatItem.id } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      await fetchCategories();
      if (data.category) {
        setForm((prev) => ({ ...prev, category: data.category.id }));
      }

      triggerSuccess(
        editingCatItem
          ? `Category '${catForm.name}' updated successfully!`
          : `Category '${catForm.name}' created and selected!`
      );
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      setCatError(err.message || "Failed to save category");
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryItem) return;
    setCatDeleting(true);
    setCatError(null);

    try {
      const url = `/api/admin/categories?id=${encodeURIComponent(deleteCategoryItem.id)}${
        catForceDelete ? "&force=true" : ""
      }`;
      const res = await fetch(url, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      await fetchCategories();
      await fetchProducts();

      // Pick next available category
      setForm((prev) => {
        const remaining = categories.filter((c) => c.id !== deleteCategoryItem.id);
        return { ...prev, category: remaining[0]?.id || "" };
      });

      triggerSuccess(`Category '${deleteCategoryItem.name}' removed successfully.`);
      setDeleteCategoryItem(null);
    } catch (err: any) {
      setCatError(err.message || "Failed to delete category");
    } finally {
      setCatDeleting(false);
    }
  };

  const autoGenerateSku = () => {
    const catCode = form.category.slice(0, 3).toUpperCase();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const sku = `IE-${catCode}-CAT-${randomDigits}`;
    setForm({ ...form, sku });
  };

  const autoGenerateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setForm({ ...form, slug });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    const catCode = "HAR";
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setForm({
      name: "",
      sku: `IE-${catCode}-CAT-${randomDigits}`,
      slug: "",
      category: "hardware-tools",
      price: 0,
      originalPrice: 0,
      image: "/uploads/2025/03/200.png",
      description: "",
      inStock: true,
      isFeatured: false,
      isNew: true,
      minOrderQty: 1,
      unit: "Piece",
      stockQuantity: 25,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      sku: (p as any).sku || `IE-PRD-${p.id.slice(-4).toUpperCase()}`,
      slug: p.slug,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      image: p.image,
      description: p.description,
      inStock: p.inStock,
      isFeatured: Boolean(p.isFeatured),
      isNew: Boolean(p.isNew),
      minOrderQty: p.minOrderQty || 1,
      unit: p.unit || "Piece",
      stockQuantity: (p as any).stockQuantity || 25,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchProducts();
        triggerSuccess(
          editingProduct
            ? `Product "${form.name}" updated successfully.`
            : `Product "${form.name}" added to catalog.`
        );
      } else {
        alert("Failed to save product");
      }
    } catch (err) {
      console.error("Save product error:", err);
      alert("Error occurred while saving product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicateProduct = async (p: Product) => {
    try {
      const copyName = `${p.name} (Copy)`;
      const copySlug = `${p.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          id: undefined,
          name: copyName,
          slug: copySlug,
        }),
      });

      if (res.ok) {
        await fetchProducts();
        triggerSuccess(`Product cloned as "${copyName}"`);
      } else {
        alert("Failed to duplicate product");
      }
    } catch (err) {
      console.error("Duplicate product error:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
        triggerSuccess("Product deleted successfully.");
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const toggleStock = async (p: Product) => {
    try {
      const updatedStock = !p.inStock;
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: updatedStock }),
      });
      if (res.ok) {
        setProducts(
          products.map((item) =>
            item.id === p.id ? { ...item, inStock: updatedStock } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle stock:", err);
    }
  };

  const toggleFeatured = async (p: Product) => {
    try {
      const updatedFeatured = !p.isFeatured;
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: updatedFeatured }),
      });
      if (res.ok) {
        setProducts(
          products.map((item) =>
            item.id === p.id ? { ...item, isFeatured: updatedFeatured } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    }
  };

  // Transactional CSV Export
  const handleExportCsv = () => {
    const headers = [
      "id",
      "sku",
      "name",
      "slug",
      "category",
      "price",
      "originalPrice",
      "inStock",
      "isFeatured",
      "unit",
      "image",
      "description",
    ];

    const rows = products.map((p) => [
      p.id,
      (p as any).sku || `IE-PRD-${p.id}`,
      `"${p.name.replace(/"/g, '""')}"`,
      p.slug,
      p.category,
      p.price,
      p.originalPrice || 0,
      p.inStock ? "true" : "false",
      p.isFeatured ? "true" : "false",
      p.unit || "Piece",
      `"${p.image}"`,
      `"${(p.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `industrial_edge_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess("Catalog CSV exported successfully.");
  };

  // Transactional CSV Import
  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          alert("CSV is empty or missing data rows.");
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
        const nameIdx = headers.indexOf("name");
        const priceIdx = headers.indexOf("price");
        const catIdx = headers.indexOf("category");

        if (nameIdx === -1 || priceIdx === -1) {
          alert("Invalid CSV: missing 'name' or 'price' column.");
          return;
        }

        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim().replace(/"/g, ""));
          const name = cols[nameIdx];
          const price = Number(cols[priceIdx]) || 1000;
          const category = catIdx !== -1 ? cols[catIdx] : "hardware-tools";

          if (name) {
            await fetch("/api/admin/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                category,
                price,
                originalPrice: Math.round(price * 1.15),
                image: "/uploads/2025/03/200.png",
                description: `Imported via bulk CSV. Category: ${category}`,
                inStock: true,
                minOrderQty: 1,
                unit: "Piece",
              }),
            });
            importedCount++;
          }
        }

        await fetchProducts();
        triggerSuccess(`Imported ${importedCount} products successfully via CSV!`);
      } catch (err) {
        console.error("CSV import error:", err);
        alert("Failed to parse CSV file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((p as any).sku && (p as any).sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock = !stockOnlyFilter || !p.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Engine A: Product & Inventory Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Products & Catalog Management
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Total of {products.length} products listed. Complete CRUD, automated SKU generation, product cloning, and bulk CSV processing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportCsv}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import Catalog via CSV"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import CSV</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Catalog to CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Refresh Catalog"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`}
            />
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Success notification */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Low-Stock Alert Trigger Banner */}
      {outOfStockCount > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                Low-Stock Threshold Alert: {outOfStockCount} product(s) currently out of stock!
              </p>
              <p className="text-[11px] text-amber-400/80">
                Automated threshold trigger reached. Replenish inventory or review restock orders.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStockOnlyFilter(!stockOnlyFilter)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 transition-colors cursor-pointer whitespace-nowrap"
          >
            {stockOnlyFilter ? "Show All Items" : "View Out-of-Stock Items"}
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search products by title, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Product / SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing (PKR)</th>
                <th className="py-3.5 px-4 text-center">Stock Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading products catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            unoptimized={p.image.startsWith("http") || p.image.startsWith("/uploads")}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs max-w-xs line-clamp-1">
                            {p.name}
                          </p>
                          <span className="font-mono text-[10px] text-cyan-400 block mt-0.5">
                            SKU: {(p as any).sku || `IE-PRD-${p.id.slice(-4).toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 capitalize">
                      {p.category.replace(/-/g, " ")}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white font-mono">
                        Rs. {p.price.toLocaleString()}
                      </div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[10px] line-through text-slate-500 font-mono">
                          Rs. {p.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleStock(p)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          p.inStock
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          p.isFeatured
                            ? "text-amber-400 hover:bg-amber-500/20"
                            : "text-slate-600 hover:text-slate-400"
                        }`}
                        title={p.isFeatured ? "Featured on Slider" : "Not Featured"}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Duplicate Button */}
                        <button
                          onClick={() => handleDuplicateProduct(p)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate / Clone Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-black text-white">
                {editingProduct ? "Edit Product Specifications" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Heavy Duty Cordless Impact Drill"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300 uppercase">
                      Product SKU *
                    </label>
                    <button
                      type="button"
                      onClick={autoGenerateSku}
                      className="text-[10px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      ⚡ Auto-Gen SKU
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-cyan-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300 uppercase">
                      URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={autoGenerateSlug}
                      className="text-[10px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      ⚡ Slugify Name
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated-from-name"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Selling Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Original / MSRP Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({ ...form, originalPrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                {/* Upload Image Option with ImageUploadField */}
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Product Image Path *"
                    value={form.image}
                    onChange={(val) => setForm({ ...form, image: val })}
                    required
                    placeholder="/uploads/2025/03/200.png"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Enter industrial specifications and product details..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                      className="rounded text-emerald-500"
                    />
                    <span>Available In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <span>Feature on Homepage Slider</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                      className="rounded text-blue-500"
                    />
                    <span>New Arrival Badge</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                  {submitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
