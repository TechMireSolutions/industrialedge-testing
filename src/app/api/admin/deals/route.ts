import { NextRequest, NextResponse } from "next/server";
import { getDeals, createDeal } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Public or Admin can view
  const deals = await getDeals();
  return NextResponse.json(deals);
}

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const newDeal = await createDeal({
      title: body.title,
      subtitle: body.subtitle || "",
      badge: body.badge || "Featured Deal",
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      image: body.image || "/uploads/2025/03/placeholder.png",
      slug: body.slug || "",
      active: body.active !== undefined ? Boolean(body.active) : true,
      order: body.order ? Number(body.order) : 1,
    });

    return NextResponse.json({ success: true, deal: newDeal });
  } catch (error) {
    console.error("Failed to create deal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
