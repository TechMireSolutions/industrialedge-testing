"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="flex-grow">{children}</main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
