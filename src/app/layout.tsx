import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import ConditionalShell from "@/components/ConditionalShell";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Industrial Edge - Online B2B Industrial & Corporate Store Pakistan",
  description: "Browse and order certified industrial tools, electronics, PPE safety equipment, cables, chemicals, and office supplies online across Pakistan.",
  icons: {
    icon: [
      { url: "/logo-icon.webp", type: "image/webp" },
    ],
    shortcut: "/logo-icon.webp",
    apple: "/logo-icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body 
        className="flex flex-col min-h-screen antialiased bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white"
        suppressHydrationWarning
      >
        <CartProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </CartProvider>
      </body>
    </html>
  );
}
