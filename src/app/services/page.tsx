import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Cpu, 
  Wrench, 
  Briefcase, 
  HardHat, 
  FlaskConical, 
  Zap, 
  Layers, 
  Settings, 
  Check, 
  ArrowRight 
} from "lucide-react";

export const metadata = {
  title: "Our Services - Industrial Edge",
  description: "Explore the comprehensive range of business procurement and industrial supply services offered by Industrial Edge across Pakistan.",
};

export default function ServicesPage() {
  const domains = [
    {
      title: "Electronic Appliances & IT Infrastructure",
      desc: "Commercial air conditioners, office automation, server racks, networking switches, surveillance CCTV, and workplace computers.",
      icon: Cpu,
      items: ["Commercial HVAC systems", "Enterprise Networking & Servers", "Workstations & Laptops", "Security & Access Control"],
      image: "/uploads/2025/03/198.png",
    },
    {
      title: "Hardware, Machinery & Power Tools",
      desc: "Industrial-grade hand tools, heavy-duty pneumatic systems, precision cutting tools, fasteners, drills, and workshop machinery.",
      icon: Wrench,
      items: ["Pneumatic & Cordless Tools", "Industrial Fasteners & Bolts", "Hydraulic Jacks & Lifts", "Machinery Spares & Belts"],
      image: "/uploads/2025/03/200.png",
    },
    {
      title: "Office Supplies, Stationery & Consumables",
      desc: "End-to-end corporate consumables, premium paper, custom stationery, breakroom products, and ergonomic office furnishings.",
      icon: Briefcase,
      items: ["Bulk A4/A3 Paper & Folders", "Printer Toners & Cartridges", "Corporate Desk Supplies", "Pantry & Cleaning Consumables"],
      image: "/uploads/2025/03/197.png",
    },
    {
      title: "Safety Equipment (PPE) & Workwear",
      desc: "Certified personal protective equipment designed to protect personnel in compliance with OSHA & industrial safety standards.",
      icon: HardHat,
      items: ["Industrial Helmets & Visors", "Steel-toe Safety Shoes", "High-visibility Vests & Coveralls", "Respirators & Hearing Protection"],
      image: "/uploads/2025/03/199.png",
    },
    {
      title: "Specialized Chemicals & Industrial Lubricants",
      desc: "High-performance motor and hydraulic oils, cooling fluids, surface treatment agents, degreasers, and industrial sealants.",
      icon: FlaskConical,
      items: ["Hydraulic & Turbine Oils", "Industrial Degreasers", "Epoxy & Sealant Systems", "Anti-corrosion Treatments"],
      image: "/uploads/2025/03/196.png",
    },
    {
      title: "Electrical Switchgear & Industrial Cabling",
      desc: "Heavy-duty electrical panels, circuit breakers, copper wiring, industrial conduit, and energy-efficient facility lighting.",
      icon: Zap,
      items: ["High & Low Voltage Cables", "Distribution Boards & Breakers", "Solar Inverters & Batteries", "Explosion-proof LED Fixtures"],
      image: "/uploads/2025/03/195.png",
    },
  ];

  return (
    <div>
      {/* Banner */}
      <section className="bg-[#151838] text-white py-16 sm:py-24 relative overflow-hidden border-b border-[#1e2352]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/03/kseniia-ilinykh-82ZiY5pzl1c-unsplash-scaled.jpg"
            alt="Supplies background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#151838] via-[#151838]/95 to-[#1e2352]/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
            Our Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 tracking-tight">Core Supply Domains</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg leading-relaxed">
            Industrial Edge simplifies procurement for businesses across Pakistan. With 100+ vetted manufacturers, we source everything your operation demands.
          </p>
        </div>
      </section>

      {/* Services List with Alternating Industrial Slate Surfaces */}
      <section className="py-20 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {domains.map((domain, idx) => {
              const Icon = domain.icon;
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#151838] to-[#059669] text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-950/20">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#151838] mb-3">{domain.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base">{domain.desc}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {domain.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                          <Check className="w-4 h-4 text-[#059669] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="category-arrow-btn"
                    >
                      <span>Inquire About {domain.title.split("&")[0].trim()}</span>
                      <span className="btn-arrow-icon">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth="2" 
                          stroke="currentColor" 
                          className="w-4 h-4"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                        </svg>
                      </span>
                    </Link>
                  </div>

                  <div className={`relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
                    <Image
                      src={domain.image}
                      alt={domain.title}
                      fill
                      className="object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Procurement Services Highlight (Contrasting from Footer) */}
      <section className="py-20 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border-t border-slate-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#151838] via-[#1a1f4a] to-[#047857] text-white text-center p-10 sm:p-14 rounded-3xl shadow-2xl relative overflow-hidden border border-emerald-500/20">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold tracking-wider uppercase text-xs mb-3 shadow-xs">
                Total Sourcing Solution
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Custom Orders & Bulk Sourcing</h2>
              <p className="text-slate-200 mt-4 mb-8 leading-relaxed text-sm sm:text-base">
                Need rare industrial machinery parts or specialized items not listed above? Our dedicated sourcing team can procure exact specification items internationally or from regional industrial hubs across Pakistan.
              </p>
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-bold rounded-xl shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all duration-200 inline-block text-sm"
              >
                Submit Custom Request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
