"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  Trash2,
  Lock
} from "lucide-react";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    companyName: "",
    ntnNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    city: "Karachi",
    paymentMethod: "bank-transfer",
    poNumber: "",
    notes: "",
  });

  const estimatedGst = Math.round(cartTotal * 0.18);
  const grandTotal = cartTotal + estimatedGst;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = "IE-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Order Confirmed & Logged
            </span>
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Purchase Order Received!
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              Thank you for choosing Industrial Edge. Your corporate procurement order reference is:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 inline-block mb-8">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Reference Order ID</span>
              <span className="text-2xl font-black text-blue-600 tracking-wider">{orderId}</span>
            </div>

            <div className="text-left bg-slate-50 rounded-2xl p-6 border border-slate-100 text-xs space-y-2 mb-8 text-slate-600">
              <p><strong>Billed To:</strong> {formData.companyName || formData.contactPerson}</p>
              <p><strong>Delivery City:</strong> {formData.city}</p>
              <p><strong>Payment Term:</strong> {formData.paymentMethod === "bank-transfer" ? "Official Corporate Bank Wire / IBAN" : "Commercial Purchase Order Credit"}</p>
              <p><strong>Next Step:</strong> Our account manager will verify inventory allocations and email your official tax-compliant proforma invoice within 2 hours.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Continue Procurement Shopping
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Secure B2B Checkout
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Complete Procurement Order
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs max-w-lg mx-auto">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Your cart is currently empty</h3>
            <p className="text-gray-500 text-sm mb-6">
              Add products from our catalog before proceeding to checkout.
            </p>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700"
            >
              Go to Store Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Details */}
              <div className="lg:col-span-7 space-y-6">
                {/* Company & Billing Info */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" /> Corporate & Billing Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Atlas Industrial Mills Ltd"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Sales Tax NTN / STRN (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.ntnNumber}
                        onChange={(e) => setFormData({ ...formData, ntnNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 1234567-8"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Tariq Mehmood"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="tariq@atlasmills.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+92 3XX XXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" /> Delivery Address & Logistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Factory / Warehouse / Site Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Plot #, Street, Industrial Area / Zone"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Delivery City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Karachi</option>
                        <option>Lahore</option>
                        <option>Islamabad / Rawalpindi</option>
                        <option>Faisalabad</option>
                        <option>Sialkot</option>
                        <option>Gujranwala</option>
                        <option>Peshawar</option>
                        <option>Hub Industrial Area</option>
                        <option>Other Nationwide Location</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                        Internal PO Reference # (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.poNumber}
                        onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. PO-2026-089"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Option */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> B2B Settlement Term
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === "bank-transfer"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "bank-transfer" })}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          Official Bank Wire / Pay Order (Direct IBAN)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Receive proforma invoice with official Industrial Edge bank account details.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={formData.paymentMethod === "credit-terms"}
                        onChange={() => setFormData({ ...formData, paymentMethod: "credit-terms" })}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          Commercial B2B Credit Term (For Registered Corporate Accounts)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Subject to credit evaluation and signed corporate supply agreements (15-30 days).
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs sticky top-28 space-y-6">
                  <h3 className="font-black text-slate-900 text-lg border-b border-gray-100 pb-3">
                    Order Summary ({cart.length} items)
                  </h3>

                  <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-3 text-xs py-2 border-b border-gray-50">
                        <div className="relative w-12 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 line-clamp-1">{item.product.name}</h5>
                          <span className="text-gray-400">Qty: {item.quantity} {item.product.unit}</span>
                        </div>
                        <span className="font-bold text-slate-900">
                          PKR {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-gray-100 text-gray-600">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-slate-900">PKR {cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18% Sales Tax)</span>
                      <span className="font-bold text-slate-900">PKR {estimatedGst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logistics & Freight</span>
                      <span className="text-emerald-600 font-bold">Standard Free Doorstep</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-gray-100">
                      <span>Grand Total</span>
                      <span className="text-blue-600 text-base">PKR {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-blue-500/20 transition flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Place Formal Procurement Order
                  </button>

                  <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 space-y-1">
                    <p className="flex items-center gap-1 font-semibold text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> 100% Guaranteed Commercial Transaction
                    </p>
                    <p>
                      Official tax invoice with NTN and batch certificates will be dispatched alongside the shipment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
