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
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/uploads/2025/03/kseniia-ilinykh-82ZiY5pzl1c-unsplash-scaled.jpg"
            alt="Supplies background"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs">Our Capabilities</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">Core Supply Domains</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg">
            Industrial Edge simplifies procurement for businesses across Pakistan. With 100+ vetted manufacturers, we source everything your operation demands.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {domains.map((domain, idx) => {
              const Icon = domain.icon;
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 rounded-2xl bg-slate-50 border border-slate-100 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{domain.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{domain.desc}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {domain.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="category-fly-btn"
                    >
                      <div className="fly-outline" />
                      <span className="fly-icon">
                        <svg width="1.15em" height="1.15em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z" fill="currentColor" />
                          <path d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="fly-text">
                        {`Inquire About ${domain.title.split("&")[0].trim()}`.split("").map((char, charIdx) => (
                          <span 
                            key={charIdx} 
                            style={{ "--i": charIdx } as React.CSSProperties}
                          >
                            {char === " " ? "\u00A0" : char}
                          </span>
                        ))}
                      </span>
                      <ArrowRight className="w-4 h-4 fly-arrow" />
                    </Link>
                  </div>

                  <div className={`relative aspect-4/3 rounded-xl overflow-hidden shadow-md ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
                    <Image
                      src={domain.image}
                      alt={domain.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Procurement Services Highlight */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs">Total Sourcing Solution</span>
          <h2 className="text-3xl font-bold mt-2 sm:text-4xl text-white">Custom Orders & Bulk Sourcing</h2>
          <p className="text-slate-300 mt-4 leading-relaxed">
            Need rare industrial machinery parts or specialized items not listed above? Our dedicated sourcing team can procure exact specification items internationally or from regional industrial hubs across Pakistan.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Submit Custom Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
