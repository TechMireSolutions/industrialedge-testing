import { NextRequest, NextResponse } from "next/server";
import { getRfqById, updateRfqQuote, deleteRfq } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const rfq = await getRfqById(id);
  if (!rfq) return NextResponse.json({ error: "RFQ not found" }, { status: 404 });

  return NextResponse.json({ success: true, rfq });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateRfqQuote(id, body);
    if (!updated) return NextResponse.json({ error: "RFQ not found" }, { status: 404 });

    return NextResponse.json({ success: true, rfq: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update RFQ" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deleted = await deleteRfq(id);
  return NextResponse.json({ success: deleted });
}
