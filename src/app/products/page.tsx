import React, { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { getProducts } from "@/lib/db";

export const metadata = {
  title: "Industrial Store & Catalog - Industrial Edge",
  description: "Browse certified industrial tools, electronics, PPE, cabling, lubricants and office stationery with real-time wholesale pricing.",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Catalog...</div>}>
      <ProductsClient initialProducts={products} />
    </Suspense>
  );
}
