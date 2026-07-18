import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { logisticsOrders, farmers, deliveryCompanies, drivers, harvests } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { logisticsOrderSchema } from "@/lib/validations";

// Helper to generate order ID
function generateOrderId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `FLM-${year}-${random}`;
}

// GET all logistics orders based on user role
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let orders;

    switch (session.role) {
      case "farmer": {
        const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, session.id)).limit(1);
        if (!farmer) return NextResponse.json({ success: false, error: "Farmer profile not found" }, { status: 404 });
        
        orders = await db
          .select()
          .from(logisticsOrders)
          .where(eq(logisticsOrders.farmerId, farmer.id))
          .orderBy(desc(logisticsOrders.createdAt));
        break;
      }
      case "delivery_partner": {
        const [company] = await db.select().from(deliveryCompanies).where(eq(deliveryCompanies.userId, session.id)).limit(1);
        if (!company) return NextResponse.json({ success: false, error: "Company profile not found" }, { status: 404 });
        
        orders = await db
          .select()
          .from(logisticsOrders)
          .where(eq(logisticsOrders.deliveryCompanyId, company.id))
          .orderBy(desc(logisticsOrders.createdAt));
        break;
      }
      case "driver": {
        const [driver] = await db.select().from(drivers).where(eq(drivers.userId, session.id)).limit(1);
        if (!driver) return NextResponse.json({ success: false, error: "Driver profile not found" }, { status: 404 });
        
        orders = await db
          .select()
          .from(logisticsOrders)
          .where(eq(logisticsOrders.driverId, driver.id))
          .orderBy(desc(logisticsOrders.createdAt));
        break;
      }
      case "admin":
        orders = await db
          .select()
          .from(logisticsOrders)
          .orderBy(desc(logisticsOrders.createdAt));
        break;
      default:
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get logistics orders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new logistics order
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
    const validatedData = logisticsOrderSchema.parse(body);

    const [newOrder] = await db
      .insert(logisticsOrders)
      .values({
        orderId: generateOrderId(),
        farmerId: farmer.id,
        pickupLocation: validatedData.pickupLocation,
        deliveryLocation: validatedData.deliveryLocation,
        pickupDate: validatedData.pickupDate || null,
        quantity: validatedData.quantity.toString(),
        unit: validatedData.unit,
        produceDetails: validatedData.produceDetails || null,
        notes: validatedData.notes || null,
        deliveryInstructions: validatedData.deliveryInstructions || null,
        farmerContact: farmer.farmName, // Use farm name as contact reference
        orderStatus: "pending",
        driverDecisionStatus: "pending",
      })
      .returning();

    // Update harvest status if linked
    if (body.harvestId) {
      await db.update(harvests)
        .set({ status: "booked", updatedAt: new Date() })
        .where(eq(harvests.id, body.harvestId));
      
      await db.update(logisticsOrders)
        .set({ harvestId: body.harvestId })
        .where(eq(logisticsOrders.id, newOrder.id));
    }

    return NextResponse.json(
      {
        success: true,
        data: newOrder,
        message: "Logistics order created successfully",
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
    console.error("Create logistics order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
