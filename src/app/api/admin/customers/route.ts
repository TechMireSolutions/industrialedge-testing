import { NextRequest, NextResponse } from "next/server";
import { getCustomers, getOrders, getRfqs } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await getCustomers();
  const orders = await getOrders();
  const rfqs = await getRfqs();

  // Attach enriched purchase ledger and RFQ count to each customer
  const enriched = customers.map((c) => {
    const custOrders = orders.filter((o) => o.email.toLowerCase() === c.email.toLowerCase());
    const custRfqs = rfqs.filter((r) => r.email.toLowerCase() === c.email.toLowerCase());
    const calculatedSpend = custOrders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.totalAmount : 0), 0);

    return {
      ...c,
      totalOrders: custOrders.length,
      totalSpend: calculatedSpend || c.totalSpend,
      orders: custOrders,
      rfqs: custRfqs,
    };
  });

  return NextResponse.json({ success: true, customers: enriched });
}
