import { NextRequest, NextResponse } from "next/server";
import { getRfqs, createRfq } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rfqs = await getRfqs();
  return NextResponse.json({ success: true, rfqs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.companyName || !body.email || !body.phone) {
      return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
    }

    const newRfq = await createRfq(body);
    return NextResponse.json({ success: true, rfq: newRfq });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create RFQ" }, { status: 500 });
  }
}
