import { NextRequest, NextResponse } from "next/server";
import { getProducts, getOrders, getInquiries, getDeals } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [products, orders, inquiries, deals] = await Promise.all([
    getProducts(),
    getOrders(),
    getInquiries(),
    getDeals(),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const newInquiries = inquiries.filter((i) => i.status === "New").length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  return NextResponse.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
    newInquiries,
    totalInquiries: inquiries.length,
    outOfStockCount,
    activeDeals: deals.filter((d) => d.active).length,
    recentOrders: orders.slice(0, 5),
    recentInquiries: inquiries.slice(0, 5),
  });
}
