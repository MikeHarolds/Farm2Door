import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { produceListings, farmers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// PUT update produce listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "farmer") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: listingId } = await params;
    const body = await request.json();

    // Get existing listing to check ownership
    const [existingListing] = await db
      .select()
      .from(produceListings)
      .where(eq(produceListings.id, parseInt(listingId)))
      .limit(1);

    if (!existingListing) {
      return NextResponse.json({ success: false, error: "Produce listing not found" }, { status: 404 });
    }

    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
    if (existingListing.farmerId !== farmer?.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updatedData: Record<string, any> = {};
    const allowedFields = [
      "produceName", "quantity", "unit", "pricePerUnit", 
      "location", "availabilityStatus", "description", 
      "category", "isOrganic"
    ];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (["quantity", "pricePerUnit"].includes(field)) {
          updatedData[field] = body[field].toString();
        } else {
          updatedData[field] = body[field];
        }
      }
    }
    updatedData.updatedAt = new Date();

    const [updatedListing] = await db
      .update(produceListings)
      .set(updatedData)
      .where(eq(produceListings.id, parseInt(listingId)))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedListing,
      message: "Produce listing updated successfully",
    });
  } catch (error) {
    console.error("Update produce listing error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE produce listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "farmer") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: listingId } = await params;

    // Get existing listing to check ownership
    const [existingListing] = await db
      .select()
      .from(produceListings)
      .where(eq(produceListings.id, parseInt(listingId)))
      .limit(1);

    if (!existingListing) {
      return NextResponse.json({ success: false, error: "Produce listing not found" }, { status: 404 });
    }

    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
    if (existingListing.farmerId !== farmer?.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await db.delete(produceListings).where(eq(produceListings.id, parseInt(listingId)));

    return NextResponse.json({
      success: true,
      message: "Produce listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete produce listing error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
