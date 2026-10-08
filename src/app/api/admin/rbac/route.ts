import { NextRequest, NextResponse } from "next/server";
import { getRbacData, saveRbacData } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await getRbacData();
  return NextResponse.json({ success: true, ...data });
}

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const current = await getRbacData();

    const updated = {
      roles: body.roles || current.roles,
      staff: body.staff || current.staff,
    };

    await saveRbacData(updated);
    return NextResponse.json({ success: true, ...updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update RBAC records" }, { status: 500 });
  }
}
