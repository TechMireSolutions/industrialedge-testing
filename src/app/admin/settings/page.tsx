"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Phone,
  Mail,
  MapPin,
  Megaphone,
  CheckCircle2,
  RefreshCw,
  Percent,
  Search,
  Globe,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Users,
  Plus,
  Trash2,
  Eye,
  Key,
  HelpCircle,
  FileText,
  Sliders,
  Check,
  X,
  AlertTriangle,
  Building,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { SiteSettings, RolePermissionItem } from "@/lib/db";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"store" | "seo" | "checkout" | "rbac">("store");

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Industrial Edge",
    tagline: "Total Corporate & Industrial Procurement Solutions",
    phone: "+92 332 2316225",
    whatsapp: "923322316225",
    email: "info@industrialedge.pk",
    address: "Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan",
    googleMapsUrl: "https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7",
    announcementText: "Corporate Discounts available on bulk annual contracts across Pakistan!",
    announcementActive: true,
    gstPercentage: 18,
    footerAbout: "From office essentials to industrial supplies, we're your trusted procurement partner across Pakistan. Simplifying supply chains with reliability, competitive pricing, and timely deliveries.",
    workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
    copyrightText: "© 2026 Industrial Edge. All rights reserved.",
    socialLinkedin: "https://linkedin.com/company/industrial-edge-pk",
    socialFacebook: "https://facebook.com/industrialedge.pk",
    socialInstagram: "https://instagram.com/industrialedge.pk",
    headerLocation: "Karachi Head Office | Nationwide Delivery",
    topBannerTag: "Direct Industrial Sourcing & Corporate Bulk Pricing",
    metaTitle: "Industrial Edge | Pakistan's Premier B2B MRO & Industrial Procurement",
    metaDescription: "Source certified industrial tools, safety PPE, automation components, and genuine bearings with verified NTN invoicing across Pakistan.",
    metaKeywords: "industrial equipment, MRO Pakistan, safety gear Karachi, tools wholesale, Siemens, Bosch, SKF",
    ogImage: "/banner.png",
    robotsIndex: true,
    canonicalUrl: "https://industrialedge.pk",
    requireZipCode: false,
    requireNtnNumber: true,
    requirePoNumber: false,
    allowGuestCheckout: true,
    taxInclusive: false,
  });

  const [roles, setRoles] = useState<RolePermissionItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingRbac, setSavingRbac] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [rbacSavedSuccess, setRbacSavedSuccess] = useState(false);

  // New staff modal state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "Catalog Manager",
  });

  // New role modal state
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: ["products:read", "orders:read"] as string[],
  });

  const availablePermissions = [
    { key: "products:all", label: "Product & Inventory CRUD" },
    { key: "inventory:all", label: "Stock Adjustment & Low-Stock Alerts" },
    { key: "orders:all", label: "Order Processing & Dispatch Pipeline" },
    { key: "rfq:all", label: "Corporate RFQ Review & Quote Issuance" },
    { key: "pricing:all", label: "Dynamic Pricing & Multi-Currency Matrix" },
    { key: "customers:all", label: "Customer Ledger & Tax Audit Inspection" },
    { key: "cms:all", label: "CMS Studio & Corporate Portal Content" },
    { key: "settings:all", label: "Global SEO & Checkout Toggles" },
    { key: "users:all", label: "Staff & RBAC Administration" },
  ];

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [settingsRes, rbacRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/rbac"),
      ]);

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings((prev) => ({ ...prev, ...settingsData }));
      }

      if (rbacRes.ok) {
        const rbacData = await rbacRes.json();
        if (rbacData.roles) setRoles(rbacData.roles);
        if (rbacData.staff) setStaff(rbacData.staff);
      }
    } catch (err) {
      console.error("Failed to load settings or RBAC data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert("Failed to update site settings");
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveRbac = async (updatedRoles?: RolePermissionItem[], updatedStaff?: StaffMember[]) => {
    setSavingRbac(true);
    setRbacSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/rbac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roles: updatedRoles || roles,
          staff: updatedStaff || staff,
        }),
      });

      if (res.ok) {
        if (updatedRoles) setRoles(updatedRoles);
        if (updatedStaff) setStaff(updatedStaff);
        setRbacSavedSuccess(true);
        setTimeout(() => setRbacSavedSuccess(false), 4000);
      } else {
        alert("Failed to update RBAC records");
      }
    } catch (err) {
      console.error("Save RBAC error:", err);
    } finally {
      setSavingRbac(false);
    }
  };

  const handleToggleStaffStatus = (id: string) => {
    const updatedStaff = staff.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setStaff(updatedStaff);
    handleSaveRbac(roles, updatedStaff);
  };

  const handleDeleteStaff = (id: string) => {
    if (!confirm("Are you sure you want to remove this staff account?")) return;
    const updatedStaff = staff.filter((s) => s.id !== id);
    setStaff(updatedStaff);
    handleSaveRbac(roles, updatedStaff);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const updatedStaff = [...staff, newMember];
    setStaff(updatedStaff);
    handleSaveRbac(roles, updatedStaff);
    setNewStaff({ name: "", email: "", role: roles[0]?.name || "Catalog Manager" });
    setShowAddStaffModal(false);
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) return;

    const roleItem: RolePermissionItem = {
      id: `role-${newRole.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
    };

    const updatedRoles = [...roles, roleItem];
    setRoles(updatedRoles);
    handleSaveRbac(updatedRoles, staff);
    setNewRole({ name: "", description: "", permissions: ["products:read", "orders:read"] });
    setShowAddRoleModal(false);
  };

  const handleDeleteRole = (id: string) => {
    if (id === "role-super-admin") {
      alert("Super Admin role cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this custom role?")) return;
    const updatedRoles = roles.filter((r) => r.id !== id);
    setRoles(updatedRoles);
    handleSaveRbac(updatedRoles, staff);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Section E • Master Controls
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Global System & Configuration Settings
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Configure site metadata, checkout & tax validation triggers, business contacts, and staff RBAC roles.
          </p>
        </div>

        <button
          onClick={fetchAllData}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer self-start sm:self-auto flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          <span className="hidden sm:inline">Refresh State</span>
        </button>
      </div>

      {/* Success Messages */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Site & configuration parameters successfully saved to database!</span>
        </div>
      )}

      {rbacSavedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Role-Based Access Control (RBAC) permissions successfully updated!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("store")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "store"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Store & Contact Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "seo"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Metadata Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checkout")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "checkout"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Checkout & Tax Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rbac")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === "rbac"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>RBAC & Staff Permissions</span>
        </button>
      </div>

      {/* TAB 1: STORE & CONTACT INFO */}
      {activeTab === "store" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Building className="w-4 h-4 text-emerald-400" /> Store Branding & Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Corporate Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Phone className="w-4 h-4 text-emerald-400" /> Official Business Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Official Phone Number
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Corporate Invoicing Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Google Maps Location URL
                </label>
                <input
                  type="text"
                  value={settings.googleMapsUrl}
                  onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Central Office / Warehouse Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-400" /> Header Announcement Bar
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                <input
                  type="checkbox"
                  checked={settings.announcementActive}
                  onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                  className="rounded text-emerald-500"
                />
                <span>Active on Storefront</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Announcement Copy
              </label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                placeholder="e.g. Special discounts available on bulk annual contracts across Pakistan!"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Top Banner Tag (when announcement is disabled)
                </label>
                <input
                  type="text"
                  value={settings.topBannerTag || ""}
                  onChange={(e) => setSettings({ ...settings, topBannerTag: e.target.value })}
                  placeholder="Direct Industrial Sourcing & Corporate Bulk Pricing"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Top Bar Location / Network Indicator
                </label>
                <input
                  type="text"
                  value={settings.headerLocation || ""}
                  onChange={(e) => setSettings({ ...settings, headerLocation: e.target.value })}
                  placeholder="Karachi Head Office | Nationwide Delivery"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Footer & Corporate Bio Customization */}
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <FileText className="w-4 h-4 text-emerald-400" /> Footer Brand Bio & Operating Schedule
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Footer Brand Description / About Blurb
              </label>
              <textarea
                rows={3}
                value={settings.footerAbout || ""}
                onChange={(e) => setSettings({ ...settings, footerAbout: e.target.value })}
                placeholder="From office essentials to industrial supplies, we're your trusted procurement partner across Pakistan..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Working Hours / Business Schedule
                </label>
                <input
                  type="text"
                  value={settings.workingHours || ""}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Footer Copyright Notice
                </label>
                <input
                  type="text"
                  value={settings.copyrightText || ""}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  placeholder="© 2026 Industrial Edge. All rights reserved."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Social Media Profiles */}
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Globe className="w-4 h-4 text-emerald-400" /> Corporate Social Media Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  LinkedIn Company URL
                </label>
                <input
                  type="text"
                  value={settings.socialLinkedin || ""}
                  onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/industrial-edge-pk"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="text"
                  value={settings.socialFacebook || ""}
                  onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                  placeholder="https://facebook.com/industrialedge.pk"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={settings.socialInstagram || ""}
                  onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                  placeholder="https://instagram.com/industrialedge.pk"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Saving Settings..." : "Save Store Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SEO & METADATA CONTROLS */}
      {activeTab === "seo" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" /> Site-Wide Search Engine Optimization (SEO)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure global meta titles, search descriptions, and OpenGraph social preview assets.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="checkbox"
                    checked={settings.robotsIndex ?? true}
                    onChange={(e) => setSettings({ ...settings, robotsIndex: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span>Allow Search Engine Indexing (index, follow)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Site-Wide Meta Title
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {(settings.metaTitle || "").length} / 60 recommended characters
                  </span>
                </div>
                <input
                  type="text"
                  value={settings.metaTitle || ""}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  placeholder="Industrial Edge | Pakistan's Premier B2B MRO & Industrial Procurement"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Meta Description
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {(settings.metaDescription || "").length} / 160 recommended characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={settings.metaDescription || ""}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  placeholder="Source certified industrial tools, safety PPE, automation components, and genuine bearings with verified NTN invoicing across Pakistan."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Meta Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={settings.metaKeywords || ""}
                    onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                    placeholder="industrial equipment, MRO Pakistan, safety gear Karachi, tools wholesale"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Canonical Domain URL
                  </label>
                  <input
                    type="url"
                    value={settings.canonicalUrl || ""}
                    onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                    placeholder="https://industrialedge.pk"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* OpenGraph Image with ImageUploadField */}
              <div className="pt-2 border-t border-white/5">
                <ImageUploadField
                  label="OpenGraph / Social Card Image (1200x630 Recommended)"
                  value={settings.ogImage || "/banner.png"}
                  onChange={(val) => setSettings({ ...settings, ogImage: val })}
                  placeholder="/banner.png or uploaded image URL"
                />
              </div>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Search className="w-3 h-3 text-emerald-400" /> Live Google Search Result Preview
              </span>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-mono">
                  {settings.canonicalUrl || "https://industrialedge.pk"}
                </p>
                <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer line-clamp-1">
                  {settings.metaTitle || "Industrial Edge | Pakistan's Premier B2B MRO & Industrial Procurement"}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {settings.metaDescription || "Source certified industrial tools, safety PPE, automation components, and genuine bearings with verified NTN invoicing across Pakistan."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Saving SEO Settings..." : "Save SEO Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CHECKOUT CUSTOMIZATION & TAX ENGINE */}
      {activeTab === "checkout" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sliders className="w-4 h-4 text-emerald-400" /> Checkout Fields & Operational Rules
            </h3>
            <p className="text-xs text-slate-400">
              Customize checkout form fields to match regional procurement workflows across Pakistan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Zip Code Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Require Postal / ZIP Code</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Disable to allow Pakistani delivery addresses without postal code validation.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.requireZipCode ?? false}
                    onChange={(e) => setSettings({ ...settings, requireZipCode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* NTN Number Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Mandatory Corporate NTN Number</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Require verified 7-digit NTN from registered companies for commercial tax invoice generation.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.requireNtnNumber ?? true}
                    onChange={(e) => setSettings({ ...settings, requireNtnNumber: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Purchase Order (PO) Number Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Require Purchase Order (PO) Number</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Make company PO field mandatory during checkout for audit reconciliation.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.requirePoNumber ?? false}
                    onChange={(e) => setSettings({ ...settings, requirePoNumber: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Guest Checkout Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">Allow Guest Checkout</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Permit buyers to place orders without creating a persistent enterprise account.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.allowGuestCheckout ?? true}
                    onChange={(e) => setSettings({ ...settings, allowGuestCheckout: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Tax Engine Configuration */}
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Percent className="w-4 h-4 text-emerald-400" /> Sales Tax & FBR Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  General Sales Tax (GST / STRN Rate %)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={settings.gstPercentage}
                    onChange={(e) => setSettings({ ...settings, gstPercentage: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <Percent className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Standard corporate GST rate across Pakistan is 18%.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Tax Calculation Mode
                </label>
                <select
                  value={settings.taxInclusive ? "inclusive" : "exclusive"}
                  onChange={(e) => setSettings({ ...settings, taxInclusive: e.target.value === "inclusive" })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="exclusive">Tax-Exclusive (GST added during cart checkout)</option>
                  <option value="inclusive">Tax-Inclusive (Catalog prices include sales tax)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">B2B procurement typically uses tax-exclusive item pricing.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-900/40 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? "Saving Checkout Rules..." : "Save Checkout & Tax Rules"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: ROLE-BASED ACCESS CONTROL (RBAC) */}
      {activeTab === "rbac" && (
        <div className="space-y-6">
          {/* Staff Accounts Card */}
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Authorized Staff Accounts
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage individual store staff, their active status, and assigned administrative roles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/40 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff User</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[11px]">
                            {s.name.charAt(0)}
                          </div>
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{s.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStaffStatus(s.id)}
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase transition cursor-pointer ${
                            s.active
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {s.active ? "Active" : "Suspended"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          title="Delete staff member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        No staff accounts registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Roles & Permissions Matrix */}
          <div className="bg-[#0f1424] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" /> Operational Roles & Permissions Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define access scopes across products, inventory, orders, corporate RFQs, and pricing engines.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddRoleModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Role</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{r.name}</span>
                        {r.id === "role-super-admin" && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                            Root System Role
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                    </div>

                    {r.id !== "role-super-admin" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(r.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                      Granted Operational Permissions
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-slate-300 border border-white/10"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STAFF */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1424] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> New Staff User Account
              </h3>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="tariq@industrialedge.pk"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Assigned Administrative Role *
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/30 transition cursor-pointer"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM ROLE */}
      {showAddRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1424] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" /> Create Custom Operational Role
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRoleModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g. Finance Auditor"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Role Description
                </label>
                <input
                  type="text"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  placeholder="e.g. Inspects financial invoices and export reports"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                  Select Granular Permissions
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availablePermissions.map((perm) => {
                    const checked = newRole.permissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          checked
                            ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                            : "bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span>{perm.label}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRole({
                                ...newRole,
                                permissions: [...newRole.permissions, perm.key],
                              });
                            } else {
                              setNewRole({
                                ...newRole,
                                permissions: newRole.permissions.filter((p) => p !== perm.key),
                              });
                            }
                          }}
                          className="rounded text-emerald-500"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddRoleModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/30 transition cursor-pointer"
                >
                  Save New Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
