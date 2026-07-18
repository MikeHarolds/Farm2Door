import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { harvests, farmers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET single harvest
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: harvestId } = await params;
    const [harvest] = await db
      .select()
      .from(harvests)
      .where(eq(harvests.id, parseInt(harvestId)))
      .limit(1);

    if (!harvest) {
      return NextResponse.json({ success: false, error: "Harvest not found" }, { status: 404 });
    }

    // Check ownership (farmers can only see their own, admins can see all)
    if (session.role === "farmer") {
      const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
      if (harvest.farmerId !== farmer?.id) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: true,
      data: harvest,
    });
  } catch (error) {
    console.error("Get harvest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update harvest
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "farmer") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: harvestId } = await params;
    const body = await request.json();

    // Get existing harvest to check ownership
    const [existingHarvest] = await db
      .select()
      .from(harvests)
      .where(eq(harvests.id, parseInt(harvestId)))
      .limit(1);

    if (!existingHarvest) {
      return NextResponse.json({ success: false, error: "Harvest not found" }, { status: 404 });
    }

    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
    if (existingHarvest.farmerId !== farmer?.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updatedData: Record<string, any> = {};
    const allowedFields = ["cropName", "quantity", "unit", "harvestDate", "farmLocation", "destinationLocation", "condition", "notes"];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "quantity") {
          updatedData[field] = body[field].toString();
        } else {
          updatedData[field] = body[field];
        }
      }
    }
    updatedData.updatedAt = new Date();

    const [updatedHarvest] = await db
      .update(harvests)
      .set(updatedData)
      .where(eq(harvests.id, parseInt(harvestId)))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedHarvest,
      message: "Harvest updated successfully",
    });
  } catch (error) {
    console.error("Update harvest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE harvest
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "farmer") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: harvestId } = await params;

    // Get existing harvest to check ownership
    const [existingHarvest] = await db
      .select()
      .from(harvests)
      .where(eq(harvests.id, parseInt(harvestId)))
      .limit(1);

    if (!existingHarvest) {
      return NextResponse.json({ success: false, error: "Harvest not found" }, { status: 404 });
    }

    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
    if (existingHarvest.farmerId !== farmer?.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await db.delete(harvests).where(eq(harvests.id, parseInt(harvestId)));

    return NextResponse.json({
      success: true,
      message: "Harvest deleted successfully",
    });
  } catch (error) {
    console.error("Delete harvest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
