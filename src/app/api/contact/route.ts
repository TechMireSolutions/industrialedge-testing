import { NextRequest, NextResponse } from "next/server";
import { createInquiry } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const inquiry = await createInquiry({
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      company: body.company || "",
      service: body.service || "General Inquiry",
      message: body.message,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry received successfully",
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error("Contact inquiry creation error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
