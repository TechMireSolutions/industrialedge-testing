import { NextRequest, NextResponse } from "next/server";
import { getPricingShippingData, savePricingShippingData } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getPricingShippingData();
  return NextResponse.json({ success: true, ...data });
}

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const current = await getPricingShippingData();

    const updated = {
      currencies: body.currencies || current.currencies,
      shippingRules: body.shippingRules || current.shippingRules,
      b2bTiers: body.b2bTiers || current.b2bTiers,
    };

    await savePricingShippingData(updated);
    return NextResponse.json({ success: true, ...updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update pricing & shipping matrix" }, { status: 500 });
  }
}
