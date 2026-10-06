import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Portfolio & Clients - Industrial Edge",
  description: "View our portfolio of corporate supply deliveries and trusted brand partners across Pakistan.",
};

export default function PortfolioPage() {
  const projects = [
    {
      title: "Commercial Facility Modernization",
      category: "IT & Electronic Infrastructure",
      desc: "Delivered enterprise network routing gear, cooling units, and 50+ ergonomic workstations to a Karachi corporate headquarter.",
      image: "/uploads/2025/02/coorp-4.jpg",
    },
    {
      title: "Heavy Manufacturing Tooling Outfitting",
      category: "Hardware & Machinery",
      desc: "Supplied precision cordless drills, pneumatic tools, safety gear, and industrial fasteners to an assembly plant in Lahore.",
      image: "/uploads/2025/02/coorp-16.jpg",
    },
    {
      title: "Nationwide Office Consumables Supply",
      category: "Corporate Stationery & Consumables",
      desc: "Monthly scheduled deliveries of premium stationery, paper, cleaning chemicals, and pantry supplies to multi-city branch network.",
      image: "/uploads/2025/02/post5.jpg",
    },
  ];

  // Brand logos extracted from WP
  const partnerLogos = [
    "/uploads/2025/02/1-1.png",
    "/uploads/2025/02/2-2.png",
    "/uploads/2025/02/3-1.png",
    "/uploads/2025/02/4-1.png",
    "/uploads/2025/02/5-2.png",
    "/uploads/2025/02/6-1.png",
    "/uploads/2025/02/7-1.png",
    "/uploads/2025/02/8-1.png",
    "/uploads/2025/02/9-1.png",
    "/uploads/2025/02/10-1.png",
    "/uploads/2025/02/11-1.png",
    "/uploads/2025/02/12-1.png",
    "/uploads/2025/02/13-1.png",
    "/uploads/2025/02/14.png",
    "/uploads/2025/02/15.png",
    "/uploads/2025/02/16.png",
    "/uploads/2025/02/17.png",
    "/uploads/2025/02/18.png",
    "/uploads/2025/02/19.png",
    "/uploads/2025/02/20.png",
    "/uploads/2025/02/21.png",
    "/uploads/2025/02/22.png",
    "/uploads/2025/02/23.png",
    "/uploads/2025/02/24.png",
  ];

  return (
    <div>
      {/* Banner */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-xs">Our Track Record</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2">Portfolio & Partner Brands</h1>
          <p className="text-slate-300 max-w-2xl mt-4 text-base sm:text-lg">
            Discover our proven delivery capability and the extensive network of industrial brands we supply.
          </p>
        </div>
      </section>

      {/* Case studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs">Recent Highlights</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 sm:text-4xl">Featured Procurement Deliveries</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((p, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                <div className="relative aspect-16/10">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-2">{p.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">{p.desc}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 gap-1 mt-auto"
                  >
                    Request Similar Supplies <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Brands Grid */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-xs">Certified Sourcing</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 sm:text-4xl">Brands & Partners We Supply</h2>
            <p className="text-gray-600 mt-4 text-base">
              We procure and distribute products from industry-leading global and local manufacturers.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 items-center">
            {partnerLogos.map((logo, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-center h-24 hover:shadow-md transition"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={logo}
                    alt={`Partner ${idx + 1}`}
                    fill
                    className="object-contain transition duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
