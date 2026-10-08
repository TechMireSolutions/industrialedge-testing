import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { verifyApiAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WEBP, SVG, and GIF images are allowed." },
        { status: 400 }
      );
    }

    // Max 10MB
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File exceeds maximum limit of 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/YYYY/MM
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const uploadDir = path.join(process.cwd(), "public", "uploads", year, month);

    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize filename and append unique random suffix
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(cleanName) || ".png";
    const baseName = path.basename(cleanName, ext);
    const uniqueSuffix = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalFilename = `${baseName}-${uniqueSuffix}${ext}`;
    const destinationPath = path.join(uploadDir, finalFilename);

    await fs.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/${year}/${month}/${finalFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: finalFilename,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error("Admin image upload failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
