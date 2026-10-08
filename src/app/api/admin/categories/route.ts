import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/db";
import { verifyApiAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const created = await createCategory({
      name: body.name,
      slug: body.slug,
      icon: body.icon,
      description: body.description,
      subcategories: body.subcategories,
    });

    return NextResponse.json({ success: true, category: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: "Category ID is required for update" }, { status: 400 });
    }

    const updated = await updateCategory(id, {
      name: body.name,
      slug: body.slug,
      icon: body.icon,
      description: body.description,
      subcategories: body.subcategories,
    });

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await verifyApiAuth(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const force = searchParams.get("force") === "true";

    if (!id) {
      return NextResponse.json({ error: "Category ID parameter is required" }, { status: 400 });
    }

    const result = await deleteCategory(id, force);
    if (!result.success) {
      return NextResponse.json({ error: result.error, requiresConfirmation: true }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}
