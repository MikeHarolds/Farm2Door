import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { harvests, farmers } from "@/db/schema";
import { eq, desc, and, like, or } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { harvestSchema } from "@/lib/validations";

// GET all harvests (for logged-in farmer) or all (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get farmer profile
    if (session.role === "farmer") {
      const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
      
      if (!farmer) {
        return NextResponse.json({ success: false, error: "Farmer profile not found" }, { status: 404 });
      }

      const farmerHarvests = await db
        .select()
        .from(harvests)
        .where(eq(harvests.farmerId, farmer.id))
        .orderBy(desc(harvests.createdAt));

      return NextResponse.json({
        success: true,
        data: farmerHarvests,
      });
    }

    // Admin can see all harvests
    if (session.role === "admin") {
      const allHarvests = await db
        .select()
        .from(harvests)
        .orderBy(desc(harvests.createdAt));

      return NextResponse.json({
        success: true,
        data: allHarvests,
      });
    }

    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Get harvests error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new harvest
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "farmer") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get farmer profile
    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
    
    if (!farmer) {
      return NextResponse.json({ success: false, error: "Farmer profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = harvestSchema.parse(body);

    const [newHarvest] = await db
      .insert(harvests)
      .values({
        farmerId: farmer.id,
        cropName: validatedData.cropName,
        quantity: validatedData.quantity.toString(),
        unit: validatedData.unit,
        harvestDate: validatedData.harvestDate,
        farmLocation: validatedData.farmLocation,
        destinationLocation: validatedData.destinationLocation || null,
        condition: validatedData.condition,
        notes: validatedData.notes || null,
      })
      .returning();

    // Update total harvests count
    await db.update(farmers).set({ 
      totalHarvests: (farmer.totalHarvests || 0) + 1 
    }).where(eq(farmers.id, farmer.id));

    return NextResponse.json(
      {
        success: true,
        data: newHarvest,
        message: "Harvest record created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Create harvest error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
