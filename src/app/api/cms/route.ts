import { NextResponse } from "next/server";
import { getCmsData } from "@/lib/db";

export async function GET() {
  try {
    const data = await getCmsData();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load CMS data" }, { status: 500 });
  }
}
