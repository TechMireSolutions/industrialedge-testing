"use client";

import React, { useState, useEffect } from "react";
import {
  Percent,
  Coins,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Save,
  Globe,
  DollarSign,
  Package,
  Layers,
  X,
} from "lucide-react";
import { CurrencyItem, ShippingRuleItem, B2BPriceTierItem } from "@/lib/db";

export default function AdminPricingShippingPage() {
  const [activeTab, setActiveTab] = useState<"currencies" | "shipping" | "b2b">("currencies");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [shippingRules, setShippingRules] = useState<ShippingRuleItem[]>([]);
  const [b2bTiers, setB2bTiers] = useState<B2BPriceTierItem[]>([]);

  // New Tier State
  const [newTier, setNewTier] = useState({
    minQuantity: 10,
    maxQuantity: 25,
    discountPercentage: 5,
    isActive: true,
  });

  // New Shipping Rule State
  const [newRule, setNewRule] = useState({
    regionName: "",
    baseFlatRate: 500,
    freeShippingThreshold: 50000,
    estimatedDeliveryDays: "2-4 Business Days",
    isActive: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pricing-shipping");
      if (res.ok) {
        const data = await res.json();
        setCurrencies(data.currencies || []);
        setShippingRules(data.shippingRules || []);
        setB2bTiers(data.b2bTiers || []);
      }
    } catch (err) {
      console.error("Failed to load pricing/shipping matrix:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveAll = async (
    updatedCurrencies = currencies,
    updatedRules = shippingRules,
    updatedTiers = b2bTiers
  ) => {
    setSaving(true);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/pricing-shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currencies: updatedCurrencies,
          shippingRules: updatedRules,
          b2bTiers: updatedTiers,
        }),
      });

      if (res.ok) {
        setCurrencies(updatedCurrencies);
        setShippingRules(updatedRules);
        setB2bTiers(updatedTiers);
        setSuccessMsg("Settings saved and synced across store pages & invoices!");
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        alert("Failed to save pricing/shipping matrix updates");
      }
    } catch (err) {
      console.error("Save matrix error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Currency Handlers
  const handleCurrencyRateChange = (code: string, newRate: number) => {
    const updated = currencies.map((c) =>
      c.code === code ? { ...c, exchangeRate: newRate } : c
    );
    setCurrencies(updated);
  };

  const setDefaultCurrency = (code: string) => {
    const updated = currencies.map((c) => ({
      ...c,
      isDefault: c.code === code,
    }));
    saveAll(updated, shippingRules, b2bTiers);
  };

  // Shipping Rule Handlers
  const handleAddShippingRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.regionName) return;

    const rule: ShippingRuleItem = {
      id: `ship-${Date.now()}`,
      ...newRule,
    };
    const updated = [...shippingRules, rule];
    setShippingRules(updated);
    saveAll(currencies, updated, b2bTiers);
    setNewRule({
      regionName: "",
      baseFlatRate: 500,
      freeShippingThreshold: 50000,
      estimatedDeliveryDays: "2-4 Business Days",
      isActive: true,
    });
  };

  const handleDeleteShippingRule = (id: string) => {
    const updated = shippingRules.filter((r) => r.id !== id);
    setShippingRules(updated);
    saveAll(currencies, updated, b2bTiers);
  };

  // B2B Tier Handlers
  const handleAddTier = (e: React.FormEvent) => {
    e.preventDefault();
    const tier: B2BPriceTierItem = {
      id: `tier-${Date.now()}`,
      minQuantity: Number(newTier.minQuantity),
      maxQuantity: newTier.maxQuantity ? Number(newTier.maxQuantity) : undefined,
      discountPercentage: Number(newTier.discountPercentage),
      isActive: true,
    };
    const updated = [...b2bTiers, tier].sort((a, b) => a.minQuantity - b.minQuantity);
    setB2bTiers(updated);
    saveAll(currencies, shippingRules, updated);
  };

  const handleDeleteTier = (id: string) => {
    const updated = b2bTiers.filter((t) => t.id !== id);
    setB2bTiers(updated);
    saveAll(currencies, shippingRules, updated);
  };

  // Edit Shipping Rule State & Handlers
  const [editingRule, setEditingRule] = useState<ShippingRuleItem | null>(null);
  const [ruleForm, setRuleForm] = useState<ShippingRuleItem>({
    id: "",
    regionName: "",
    baseFlatRate: 500,
    freeShippingThreshold: 50000,
    estimatedDeliveryDays: "2-4 Business Days",
    isActive: true,
  });

  const openEditShippingRule = (rule: ShippingRuleItem) => {
    setEditingRule(rule);
    setRuleForm({ ...rule });
  };

  const handleUpdateShippingRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    const updated = shippingRules.map((r) =>
      r.id === editingRule.id ? { ...ruleForm } : r
    );
    setShippingRules(updated);
    saveAll(currencies, updated, b2bTiers);
    setEditingRule(null);
  };

  // Edit B2B Tier State & Handlers
  const [editingTier, setEditingTier] = useState<B2BPriceTierItem | null>(null);
  const [tierForm, setTierForm] = useState<B2BPriceTierItem>({
    id: "",
    minQuantity: 1,
    maxQuantity: undefined,
    discountPercentage: 5,
    isActive: true,
  });

  const openEditTier = (tier: B2BPriceTierItem) => {
    setEditingTier(tier);
    setTierForm({ ...tier });
  };

  const handleUpdateTier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    const updated = b2bTiers
      .map((t) => (t.id === editingTier.id ? { ...tierForm } : t))
      .sort((a, b) => a.minQuantity - b.minQuantity);
    setB2bTiers(updated);
    saveAll(currencies, shippingRules, updated);
    setEditingTier(null);
  };

  // Edit Currency State & Handlers
  const [editingCurrency, setEditingCurrency] = useState<CurrencyItem | null>(null);
  const [currencyForm, setCurrencyForm] = useState<CurrencyItem>({
    code: "",
    name: "",
    symbol: "",
    exchangeRate: 1,
    isDefault: false,
    isActive: true,
    formatToken: "{symbol} {amount}",
  });

  const openEditCurrency = (curr: CurrencyItem) => {
    setEditingCurrency(curr);
    setCurrencyForm({ ...curr });
  };

  const handleUpdateCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCurrency) return;
    const updated = currencies.map((c) =>
      c.code === editingCurrency.code ? { ...currencyForm } : c
    );
    setCurrencies(updated);
    saveAll(updated, shippingRules, b2bTiers);
    setEditingCurrency(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Percent className="w-4 h-4" />
            <span>Commercial Rules Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Dynamic Pricing & Shipping Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure multi-currency tokens, regional delivery overrides, and tiered B2B wholesale discount matrices.
          </p>
        </div>

        <button
          onClick={() => saveAll()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save All Matrix Rules"}</span>
        </button>
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
          onClick={() => setActiveTab("currencies")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "currencies"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Multi-Currency Control</span>
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "shipping"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Shipping Rules Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("b2b")}
          className={`pb-3 px-3 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
            activeTab === "b2b"
              ? "text-emerald-400 border-emerald-500"
              : "text-slate-400 border-transparent hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tiered B2B Volume Pricing</span>
        </button>
      </div>

      {/* TAB 1: CURRENCIES */}
      {activeTab === "currencies" && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Base Store Currency: PKR (Pakistani Rupee)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All catalog unit prices and inventory values are anchored in PKR. Exchange rates dynamically convert pricing on multi-currency store views & generated invoices.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Currency Code</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Symbol</th>
                  <th className="py-3.5 px-4">Exchange Rate (vs PKR)</th>
                  <th className="py-3.5 px-4">Format Token</th>
                  <th className="py-3.5 px-4 text-center">Default Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {currencies.map((curr) => (
                  <tr key={curr.code} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {curr.code}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">{curr.name}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">
                      {curr.symbol}
                    </td>
                    <td className="py-3.5 px-4">
                      {curr.code === "PKR" ? (
                        <span className="font-mono text-slate-400 font-bold">1.0000 (Base)</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.01"
                            value={curr.exchangeRate}
                            onChange={(e) =>
                              handleCurrencyRateChange(curr.code, Number(e.target.value))
                            }
                            className="w-24 px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                          />
                          <span className="text-[11px] text-slate-500">PKR</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {curr.formatToken}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {curr.isDefault ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Primary Default
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDefaultCurrency(curr.code)}
                          className="px-2 py-1 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          Make Default
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditCurrency(curr)}
                        className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Currency Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SHIPPING RULES */}
      {activeTab === "shipping" && (
        <div className="space-y-6">
          {/* Add Shipping Rule Form */}
          <form
            onSubmit={handleAddShippingRule}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Regional Delivery Override Rule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Region / Territory *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisalabad Industrial Zone"
                  value={newRule.regionName}
                  onChange={(e) => setNewRule({ ...newRule, regionName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Base Flat Rate (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newRule.baseFlatRate}
                  onChange={(e) => setNewRule({ ...newRule, baseFlatRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Free Delivery Threshold (Rs.)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newRule.freeShippingThreshold}
                  onChange={(e) =>
                    setNewRule({ ...newRule, freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Delivery Time Window
                </label>
                <input
                  type="text"
                  value={newRule.estimatedDeliveryDays}
                  onChange={(e) =>
                    setNewRule({ ...newRule, estimatedDeliveryDays: e.target.value })
                  }
                  placeholder="2-4 Business Days"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Add Shipping Rule
              </button>
            </div>
          </form>

          {/* Shipping Rules Table */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Region Name / Coverage</th>
                  <th className="py-3.5 px-4">Base Flat Delivery Fee</th>
                  <th className="py-3.5 px-4">Free Shipping Condition</th>
                  <th className="py-3.5 px-4">Estimated Transit</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {shippingRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {rule.regionName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      Rs. {rule.baseFlatRate.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">
                      {rule.freeShippingThreshold > 0
                        ? `Orders > Rs. ${rule.freeShippingThreshold.toLocaleString()}`
                        : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{rule.estimatedDeliveryDays}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditShippingRule(rule)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Shipping Rule"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteShippingRule(rule.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Shipping Rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TIERED B2B PRICING */}
      {activeTab === "b2b" && (
        <div className="space-y-6">
          {/* Add Tier Form */}
          <form
            onSubmit={handleAddTier}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4"
          >
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Define Wholesale Volume Discount Tier</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Min Quantity (Units) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newTier.minQuantity}
                  onChange={(e) =>
                    setNewTier({ ...newTier, minQuantity: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Max Quantity (Leave blank for 50+)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newTier.maxQuantity || ""}
                  onChange={(e) =>
                    setNewTier({
                      ...newTier,
                      maxQuantity: e.target.value ? Number(e.target.value) : undefined as any,
                    })
                  }
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Discount Percentage (%) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  max={90}
                  required
                  value={newTier.discountPercentage}
                  onChange={(e) =>
                    setNewTier({
                      ...newTier,
                      discountPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Add Tier Matrix Rule
              </button>
            </div>
          </form>

          {/* B2B Tiers Table */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Order Quantity Range</th>
                  <th className="py-3.5 px-4">Discount Off Retail Rate</th>
                  <th className="py-3.5 px-4">Applicability</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {b2bTiers.map((tier) => (
                  <tr key={tier.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {tier.minQuantity} {tier.maxQuantity ? `– ${tier.maxQuantity}` : "+"} units
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {tier.discountPercentage}% OFF
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      Site-wide Wholesale Bulk Trigger
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditTier(tier)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Edit Volume Discount Tier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTier(tier.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* EDIT SHIPPING RULE MODAL */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Shipping Rule</h3>
                  <p className="text-[11px] text-slate-400 font-normal">{editingRule.regionName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingRule(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateShippingRule} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Region / Territory Name *
                </label>
                <input
                  type="text"
                  required
                  value={ruleForm.regionName}
                  onChange={(e) => setRuleForm({ ...ruleForm, regionName: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Base Flat Rate (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={ruleForm.baseFlatRate}
                    onChange={(e) => setRuleForm({ ...ruleForm, baseFlatRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Free Delivery Threshold (Rs.)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={ruleForm.freeShippingThreshold}
                    onChange={(e) =>
                      setRuleForm({ ...ruleForm, freeShippingThreshold: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Estimated Delivery Time Window
                </label>
                <input
                  type="text"
                  value={ruleForm.estimatedDeliveryDays}
                  onChange={(e) =>
                    setRuleForm({ ...ruleForm, estimatedDeliveryDays: e.target.value })
                  }
                  placeholder="e.g. 2-4 Business Days"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  Update Shipping Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT B2B VOLUME DISCOUNT TIER MODAL */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Wholesale Volume Discount Tier</h3>
                  <p className="text-[11px] text-slate-400 font-normal">
                    {editingTier.minQuantity} {editingTier.maxQuantity ? `– ${editingTier.maxQuantity}` : "+"} units range
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTier} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Min Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={tierForm.minQuantity}
                    onChange={(e) =>
                      setTierForm({ ...tierForm, minQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Max Quantity (Leave blank for 50+)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={tierForm.maxQuantity ?? ""}
                    onChange={(e) =>
                      setTierForm({
                        ...tierForm,
                        maxQuantity: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Discount Percentage (%) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  max={90}
                  required
                  value={tierForm.discountPercentage}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, discountPercentage: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  Update Tier Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CURRENCY MODAL */}
      {editingCurrency && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Currency Parameters</h3>
                  <p className="text-[11px] text-slate-400 font-normal">{editingCurrency.name} ({editingCurrency.code})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCurrency(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCurrency} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Currency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={currencyForm.name}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    required
                    value={currencyForm.symbol}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, symbol: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono font-bold text-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Exchange Rate (vs PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={currencyForm.code === "PKR"}
                    value={currencyForm.exchangeRate}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, exchangeRate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                    Format Token
                  </label>
                  <input
                    type="text"
                    required
                    value={currencyForm.formatToken}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, formatToken: e.target.value })
                    }
                    placeholder="{symbol} {amount}"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCurrency(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-lg shadow-emerald-950/50 cursor-pointer"
                >
                  Update Currency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
