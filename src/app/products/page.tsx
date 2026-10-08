import React, { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { getProducts } from "@/lib/db";
import { PRODUCTS, Product } from "@/data/products";

export const metadata = {
  title: "Industrial Store & Catalog - Industrial Edge",
  description: "Browse certified industrial tools, electronics, PPE, cabling, lubricants and office stationery with real-time wholesale pricing.",
};

interface PageProps {
  searchParams?: Promise<{ category?: string; q?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  let initialCategory = "all";
  let initialQuery = "";

  try {
    if (searchParams) {
      const sp = await searchParams;
      initialCategory = sp?.category || "all";
      initialQuery = sp?.q || "";
    }
  } catch {
    // build time fallback
  }

  let products: Product[] = [];
  try {
    products = await getProducts();
    if (!products || products.length === 0) {
      products = PRODUCTS;
    }
  } catch (err) {
    console.warn("Fallback to static products on /products page:", err);
    products = PRODUCTS;
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Catalog...</div>}>
      <ProductsClient
        initialProducts={products}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
      />
    </Suspense>
  );
}
