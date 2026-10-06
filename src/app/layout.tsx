import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Industrial Edge - Online B2B Industrial & Corporate Store Pakistan",
  description: "Browse and order certified industrial tools, electronics, PPE safety equipment, cables, chemicals, and office supplies online across Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
