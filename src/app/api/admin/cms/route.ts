import { NextRequest, NextResponse } from "next/server";
import { getCmsData, saveCmsData } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getCmsData();
  return NextResponse.json({ success: true, ...data });
}

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const current = await getCmsData();

    const updated = {
      corporate: body.corporate || current.corporate,
      faqs: body.faqs || current.faqs,
      policies: body.policies || current.policies,
      brands: body.brands || current.brands,
    };

    await saveCmsData(updated);
    return NextResponse.json({ success: true, ...updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update CMS studio data" }, { status: 500 });
  }
}
