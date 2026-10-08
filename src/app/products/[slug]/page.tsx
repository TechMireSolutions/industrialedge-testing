import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, Product } from "@/data/products";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const resolvedParams = params && typeof (params as any).then === "function" ? await params : (params as any);
    const slug = resolvedParams?.slug;
    if (!slug) return { title: "Product - Industrial Edge" };

    const product = (await getProductBySlug(slug)) || PRODUCTS.find((p) => p.slug === slug);
    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.name} - Industrial Edge`,
      description: product.description,
    };
  } catch {
    return {
      title: "Product - Industrial Edge",
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = params && typeof (params as any).then === "function" ? await params : (params as any);
  const slug = resolvedParams?.slug;

  let product: Product | null = null;
  if (slug) {
    try {
      product = (await getProductBySlug(slug)) || PRODUCTS.find((p) => p.slug === slug) || null;
    } catch {
      product = PRODUCTS.find((p) => p.slug === slug) || null;
    }
  }

  if (!product) {
    notFound();
  }

  let allProducts: Product[] = [];
  try {
    allProducts = await getProducts();
  } catch {
    allProducts = PRODUCTS;
  }
  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-gradient-to-b from-slate-100 via-slate-50 to-[#f8fafc] min-h-screen selection:bg-[#059669] selection:text-white pb-16">
      {/* Top Brand Header Banner with Contrast */}
      <section className="bg-gradient-to-r from-[#111538] via-[#172554] to-[#044337] text-white py-6 sm:py-7 relative overflow-hidden border-b border-emerald-500/20">
        {/* Ambient glowing orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#059669]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Breadcrumb Trail */}
            <nav className="flex items-center space-x-2 text-xs text-slate-300 flex-wrap gap-y-1">
              <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              <span className="text-slate-500">/</span>
              <Link href="/products" className="hover:text-emerald-400 transition-colors">Store</Link>
              <span className="text-slate-500">/</span>
              <Link 
                href={`/products?category=${product.category || 'all'}`} 
                className="hover:text-emerald-400 transition-colors capitalize"
              >
                {(product.category || 'general').replace("-", " ")}
              </Link>
              <span className="text-slate-500">/</span>
              <span className="text-emerald-300 font-semibold truncate max-w-sm">{product.name}</span>
            </nav>

            {/* Quick Status Tags */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] font-semibold text-slate-200">
                SKU: IE-{String(product.id || '').replace(/^prod-/, '').padStart(4, "0")}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> In Stock & Ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Product Details */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}
