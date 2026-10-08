"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sliders,
  Building2,
  HelpCircle,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  ExternalLink,
  Sparkles,
  CheckCircle,
  Award,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { CmsStudioData, CmsFaqItem, CmsPolicyItem } from "@/lib/db";

export default function AdminCmsStudioPage() {
  const [activeTab, setActiveTab] = useState<"corporate" | "brands" | "faqs" | "policies">("corporate");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [cmsData, setCmsData] = useState<CmsStudioData>({
    corporate: {
      title: "",
      subtitle: "",
      ctaText: "",
      ctaLink: "",
      features: [],
    },
    faqs: [],
    policies: [],
    brands: {
      heading: "Supplying Products From Leading Industrial Brands",
      active: true,
      logos: [],
    },
  });

  const [newBrandLogo, setNewBrandLogo] = useState("");

  // State for new FAQ
  const [newFaq, setNewFaq] = useState({
    category: "B2B Procurement",
    question: "",
    answer: "",
    order: 1,
    active: true,
  });

  // State for new feature bullet
  const [newFeatureText, setNewFeatureText] = useState("");

  // State for selected policy being edited
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState(0);

  const fetchCmsData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/cms");
      if (res.ok) {
        const data = await res.json();
        setCmsData({
          corporate: data.corporate || { title: "", subtitle: "", ctaText: "", ctaLink: "", features: [] },
          faqs: data.faqs || [],
          policies: data.policies || [],
          brands: data.brands || {
            heading: "Supplying Products From Leading Industrial Brands",
            active: true,
            logos: [],
          },
        });
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsData();
  }, []);

  const saveCms = async (updatedData = cmsData) => {
    setSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setCmsData(updatedData);
        setSuccessMsg("CMS studio updates published to live store pages!");
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        alert("Failed to save CMS updates");
      }
    } catch (err) {
      console.error("Save CMS error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Corporate Feature Handlers
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const updatedFeatures = [...cmsData.corporate.features, newFeatureText.trim()];
    const updated = {
      ...cmsData,
      corporate: { ...cmsData.corporate, features: updatedFeatures },
    };
    setCmsData(updated);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (idx: number) => {
    const updatedFeatures = cmsData.corporate.features.filter((_, i) => i !== idx);
    const updated = {
      ...cmsData,
      corporate: { ...cmsData.corporate, features: updatedFeatures },
    };
    setCmsData(updated);
  };

  // FAQ Handlers
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    const faqItem: CmsFaqItem = {
      id: `faq-${Date.now()}`,
      ...newFaq,
    };
    const updated = {
      ...cmsData,
      faqs: [...cmsData.faqs, faqItem],
    };
    setCmsData(updated);
    saveCms(updated);
    setNewFaq({
      category: "B2B Procurement",
      question: "",
      answer: "",
      order: cmsData.faqs.length + 1,
      active: true,
    });
  };

  const handleDeleteFaq = (id: string) => {
    const updated = {
      ...cmsData,
      faqs: cmsData.faqs.filter((f) => f.id !== id),
    };
    setCmsData(updated);
    saveCms(updated);
  };

  // Policy Handlers
  const handlePolicyChange = (field: keyof CmsPolicyItem, val: any) => {
    const updatedPolicies = [...cmsData.policies];
    if (updatedPolicies[selectedPolicyIndex]) {
      updatedPolicies[selectedPolicyIndex] = {
        ...updatedPolicies[selectedPolicyIndex],
        [field]: val,
        updatedAt: new Date().toISOString(),
      };
      setCmsData({ ...cmsData, policies: updatedPolicies });
    }
  };

  // Brand Marquee Handlers
  const handleAddBrandLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandLogo.trim()) return;
    const currentLogos = cmsData.brands?.logos || [];
    const updated: CmsStudioData = {
      ...cmsData,
      brands: {
        heading: cmsData.brands?.heading || "Supplying Products From Leading Industrial Brands",
        active: cmsData.brands?.active ?? true,
        logos: [...currentLogos, newBrandLogo.trim()],
      },
    };
    setCmsData(updated);
    saveCms(updated);
    setNewBrandLogo("");
  };

  const handleDeleteBrandLogo = (index: number) => {
    const currentLogos = cmsData.brands?.logos || [];
    const updated: CmsStudioData = {
      ...cmsData,
      brands: {
        heading: cmsData.brands?.heading || "Supplying Products From Leading Industrial Brands",
        active: cmsData.brands?.active ?? true,
        logos: currentLogos.filter((_, idx) => idx !== index),
      },
    };
    setCmsData(updated);
    saveCms(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Site Content & Copy Studio</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Content & CMS Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically update "For Corporate" B2B landing pages, categorized FAQs, and compliance policy documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/deals"
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Manage Hero Banners</span>
          </Link>

          <button
            onClick={() => saveCms()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing..." : "Publish Live CMS Updates"}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab("corporate")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "corporate"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>"For Corporate" B2B Portal Content</span>
        </button>

        <button
          onClick={() => setActiveTab("brands")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "brands"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Brand Partners Marquee</span>
        </button>

        <button
          onClick={() => setActiveTab("faqs")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "faqs"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Categorized FAQs Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "policies"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Policy & Compliance Documents</span>
        </button>
      </div>

      {/* TAB 1: CORPORATE B2B PORTAL CONTENT */}
      {activeTab === "corporate" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Corporate Portal Hero & Main Value Proposition
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={cmsData.corporate.title}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      corporate: { ...cmsData.corporate, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Subheadline / Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={cmsData.corporate.subtitle}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      corporate: { ...cmsData.corporate, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Primary CTA Button Copy
                </label>
                <input
                  type="text"
                  value={cmsData.corporate.ctaText}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      corporate: { ...cmsData.corporate, ctaText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Primary CTA Target Link
                </label>
                <input
                  type="text"
                  value={cmsData.corporate.ctaLink}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      corporate: { ...cmsData.corporate, ctaLink: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Corporate Value Pillars */}
            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                Corporate Value Proposition Bullets
              </label>

              <div className="space-y-2 mb-3">
                {cmsData.corporate.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new corporate procurement feature..."
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Add Bullet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          {/* Add FAQ Form */}
          <form
            onSubmit={handleAddFaq}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add FAQ Question & Answer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Category *
                </label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="B2B Procurement">B2B Procurement & NTN</option>
                  <option value="Logistics & Delivery">Logistics & Delivery</option>
                  <option value="Warranty & Support">Warranty & Equipment Support</option>
                  <option value="Payment Terms">Payment Terms & Corporate PO</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can we claim input tax credit on corporate purchases?"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Comprehensive Answer *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide an informative answer for corporate buyers..."
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Publish FAQ Item
              </button>
            </div>
          </form>

          {/* FAQs List */}
          <div className="space-y-3">
            {cmsData.faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-start justify-between gap-4"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-400 mb-1">
                    {faq.category}
                  </span>
                  <h4 className="text-xs font-bold text-white">{faq.question}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POLICIES */}
      {activeTab === "policies" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Policy Selector */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Select Compliance Document
              </h3>
              {cmsData.policies.map((pol, idx) => (
                <button
                  key={pol.id}
                  onClick={() => setSelectedPolicyIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedPolicyIndex === idx
                      ? "bg-slate-800/80 border-emerald-500/40 text-white"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-bold text-xs">{pol.title}</div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                    /{pol.slug}
                  </div>
                </button>
              ))}
            </div>

            {/* Policy Content Editor */}
            <div className="lg:col-span-2 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              {cmsData.policies[selectedPolicyIndex] ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Edit Document Content
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500">
                        Slug: /{cmsData.policies[selectedPolicyIndex].slug}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cmsData.policies[selectedPolicyIndex].published}
                        onChange={(e) => handlePolicyChange("published", e.target.checked)}
                        className="w-4 h-4 accent-emerald-500 rounded"
                      />
                      <span className="text-xs text-slate-300 font-semibold">Published</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                      Document Title
                    </label>
                    <input
                      type="text"
                      value={cmsData.policies[selectedPolicyIndex].title}
                      onChange={(e) => handlePolicyChange("title", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                      Policy Copy & Legal Terms (Markdown / Plain Text)
                    </label>
                    <textarea
                      rows={10}
                      value={cmsData.policies[selectedPolicyIndex].content}
                      onChange={(e) => handlePolicyChange("content", e.target.value)}
                      className="w-full p-3.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">Select a policy to edit.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: BRAND PARTNERS MARQUEE */}
      {activeTab === "brands" && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Homepage Brand Marquee Slider Settings</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control the continuous brand partners marquee ticker shown on the store homepage and portfolio.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={cmsData.brands?.active ?? true}
                  onChange={(e) => {
                    const updated = {
                      ...cmsData,
                      brands: {
                        heading: cmsData.brands?.heading || "Supplying Products From Leading Industrial Brands",
                        active: e.target.checked,
                        logos: cmsData.brands?.logos || [],
                      },
                    };
                    setCmsData(updated);
                    saveCms(updated);
                  }}
                  className="rounded text-emerald-500"
                />
                <span>Active on Homepage</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Section Heading Text
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cmsData.brands?.heading || ""}
                  onChange={(e) =>
                    setCmsData({
                      ...cmsData,
                      brands: {
                        heading: e.target.value,
                        active: cmsData.brands?.active ?? true,
                        logos: cmsData.brands?.logos || [],
                      },
                    })
                  }
                  placeholder="e.g. Supplying Products From Leading Industrial Brands"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => saveCms()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Save Title
                </button>
              </div>
            </div>
          </div>

          {/* Add Brand Logo Form */}
          <form
            onSubmit={handleAddBrandLogo}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Brand Partner Logo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Brand Logo Path / Upload Image *"
                  value={newBrandLogo}
                  onChange={(val) => setNewBrandLogo(val)}
                  placeholder="/uploads/2025/02/1-1.png"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Logo to Strip</span>
                </button>
              </div>
            </div>
          </form>

          {/* Current Brand Logos Grid */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Current Brand Logos (Total: {cmsData.brands?.logos?.length || 0})
              </h4>
              <span className="text-[11px] text-slate-400">
                Logos scroll in a continuous seamless loop on the storefront
              </span>
            </div>

            {(!cmsData.brands?.logos || cmsData.brands.logos.length === 0) ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No brand logos configured yet. Add your first logo above!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {cmsData.brands.logos.map((logo, idx) => (
                  <div
                    key={idx}
                    className="relative group bg-white rounded-xl p-3 flex flex-col items-center justify-center border border-slate-200 h-24 hover:shadow-lg transition-all"
                  >
                    <div className="relative w-full h-14">
                      <Image
                        src={logo}
                        alt={`Brand logo ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono truncate w-full text-center mt-1">
                      #{idx + 1}
                    </span>

                    {/* Delete overlay */}
                    <button
                      type="button"
                      onClick={() => handleDeleteBrandLogo(idx)}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
