import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!body.contactPerson || !body.email || !body.phone || !body.deliveryAddress) {
      return NextResponse.json(
        { error: "Missing required contact or delivery information" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      companyName: body.companyName || "",
      contactPerson: body.contactPerson,
      email: body.email,
      phone: body.phone,
      ntnNumber: body.ntnNumber || "",
      deliveryAddress: body.deliveryAddress,
      city: body.city || "Karachi",
      paymentMethod: body.paymentMethod || "bank-transfer",
      poNumber: body.poNumber || "",
      notes: body.notes || "",
      items: body.items,
      subtotal: Number(body.subtotal || 0),
      gstAmount: Number(body.gstAmount || 0),
      totalAmount: Number(body.totalAmount || 0),
      status: "Pending",
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      order,
    });
  } catch (error) {
    console.error("Checkout order creation error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
