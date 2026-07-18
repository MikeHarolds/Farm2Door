import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { logisticsOrders, drivers as driverTable, deliveryCompanies } from "@/db/schema";
import { eq, desc, and, isNull } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET orders for a driver (assigned and available)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "driver") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [driver] = await db
      .select()
      .from(driverTable)
      .where(eq(driverTable.userId, session.id))
      .limit(1);

    if (!driver) {
      return NextResponse.json({ success: false, error: "Driver profile not found" }, { status: 404 });
    }

    // Get assigned orders to this driver
    const assignedOrders = await db
      .select()
      .from(logisticsOrders)
      .where(eq(logisticsOrders.driverId, driver.id))
      .orderBy(desc(logisticsOrders.createdAt));

    return NextResponse.json({
      success: true,
      data: {
        driver,
        assignedOrders,
      },
    });
  } catch (error) {
    console.error("Get driver orders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
