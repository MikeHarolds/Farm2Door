import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { produceListings, farmers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { produceListingSchema } from "@/lib/validations";

// GET all produce listings (for logged-in farmer) or all (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "farmer") {
      const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
      
      if (!farmer) {
        return NextResponse.json({ success: false, error: "Farmer profile not found" }, { status: 404 });
      }

      const listings = await db
        .select()
        .from(produceListings)
        .where(eq(produceListings.farmerId, farmer.id))
        .orderBy(desc(produceListings.createdAt));

      return NextResponse.json({
        success: true,
        data: listings,
      });
    }

    // Admin can see all listings
    if (session.role === "admin") {
      const allListings = await db
        .select()
        .from(produceListings)
        .orderBy(desc(produceListings.createdAt));

      return NextResponse.json({
        success: true,
        data: allListings,
      });
    }

    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  } catch (error) {
    console.error("Get produce listings error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new produce listing
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "farmer") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
    
    if (!farmer) {
      return NextResponse.json({ success: false, error: "Farmer profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = produceListingSchema.parse(body);

    const [newListing] = await db
      .insert(produceListings)
      .values({
        farmerId: farmer.id,
        produceName: validatedData.produceName,
        quantity: validatedData.quantity.toString(),
        unit: validatedData.unit,
        pricePerUnit: validatedData.pricePerUnit.toString(),
        location: validatedData.location,
        availabilityStatus: validatedData.availabilityStatus || "available",
        description: validatedData.description || null,
        category: validatedData.category || null,
        isOrganic: validatedData.isOrganic ?? false,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newListing,
        message: "Produce listing created successfully",
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
    console.error("Create produce listing error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
