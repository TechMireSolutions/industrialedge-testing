import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} - Industrial Edge`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-gradient-to-b from-slate-100 via-slate-50 to-[#f8fafc] min-h-screen selection:bg-[#059669] selection:text-white pb-16">
      {/* Top Brand Header Banner with Contrast */}
      <section className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white py-10 lg:py-14 relative overflow-hidden border-b border-emerald-500/20">
        {/* Ambient glowing orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs text-slate-300 mb-4 flex-wrap gap-y-1">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span className="text-slate-500">/</span>
            <Link href="/products" className="hover:text-emerald-400 transition-colors">Store</Link>
            <span className="text-slate-500">/</span>
            <Link 
              href={`/products?category=${product.category}`} 
              className="hover:text-emerald-400 transition-colors capitalize"
            >
              {product.category.replace("-", " ")}
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-emerald-300 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Header Title & Tags */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                Certified Industrial Quality
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {product.name}
              </h1>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-slate-200">
                SKU: IE-{product.id.toString().padStart(4, "0")}
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> In Stock & Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Product Details */}
      <div className="w-full px-4 sm:px-8 lg:px-12 -mt-6 sm:-mt-8 relative z-20">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}
