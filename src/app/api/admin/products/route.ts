import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const newProduct = await createProduct({
      name: body.name,
      slug: body.slug,
      category: body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      rating: body.rating ? Number(body.rating) : 5.0,
      reviewsCount: body.reviewsCount ? Number(body.reviewsCount) : 0,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
      isFeatured: Boolean(body.isFeatured),
      isNew: Boolean(body.isNew),
      image: body.image || "/uploads/2025/03/placeholder.png",
      description: body.description || "",
      specifications: body.specifications || {},
      minOrderQty: body.minOrderQty ? Number(body.minOrderQty) : 1,
      unit: body.unit || "Piece",
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
