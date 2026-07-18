import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { logisticsOrders, drivers, deliveryCompanies, farmers, harvests, activityLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET single logistics order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;
    const [order] = await db
      .select()
      .from(logisticsOrders)
      .where(eq(logisticsOrders.id, parseInt(orderId)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get logistics order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update logistics order (status updates, assignment)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;
    const body = await request.json();

    // Get existing order
    const [existingOrder] = await db
      .select()
      .from(logisticsOrders)
      .where(eq(logisticsOrders.id, parseInt(orderId)))
      .limit(1);

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updatedData: Record<string, any> = {};

    // Handle different user role actions
    switch (session.role) {
      case "driver":
        // Driver actions: accept/reject order, update status
        const [driver] = await db.select().from(drivers).where(eq(drivers.userId, session.id)).limit(1);
        
        if (!driver || existingOrder.driverId !== driver.id) {
          return NextResponse.json({ success: false, error: "Not your assigned order" }, { status: 403 });
        }

        if (body.decision === "accept") {
          updatedData.driverDecisionStatus = "accepted";
          updatedData.orderStatus = "accepted";
        } else if (body.decision === "reject") {
          updatedData.driverDecisionStatus = "rejected";
          updatedData.orderStatus = "pending"; // Back to pool
          updatedData.driverId = null;
        } else if (body.status) {
          const validStatuses = ["en_route_to_pickup", "picked_up", "in_transit", "delivered"];
          if (validStatuses.includes(body.status)) {
            updatedData.orderStatus = body.status;
            
            if (body.status === "delivered") {
              updatedData.deliveryDate = new Date().toISOString().split('T')[0];
            }
          }
        }
        break;

      case "delivery_partner":
        // Partner can assign orders to drivers
        const [company] = await db.select().from(deliveryCompanies).where(eq(deliveryCompanies.userId, session.id)).limit(1);
        
        if (!company || existingOrder.deliveryCompanyId !== company.id) {
          return NextResponse.json({ success: false, error: "Not your company's order" }, { status: 403 });
        }

        if (body.assignDriver !== undefined) {
          // Verify driver belongs to this company
          const [targetDriver] = await db.select().from(drivers)
            .where(and(eq(drivers.id, body.assignDriver), eq(drivers.deliveryCompanyId, company.id)))
            .limit(1);
          
          if (targetDriver) {
            updatedData.driverId = targetDriver.id;
            updatedData.orderStatus = "assigned";
            updatedData.driverDecisionStatus = "pending";
          }
        }
        break;

      case "admin":
        // Admin can update anything
        if (body.status) updatedData.orderStatus = body.status;
        if (body.priceEstimate !== undefined) updatedData.priceEstimate = body.priceEstimate.toString();
        if (body.finalPrice !== undefined) updatedData.finalPrice = body.finalPrice.toString();
        if (body.deliveryCompanyId !== undefined) updatedData.deliveryCompanyId = body.deliveryCompanyId;
        if (body.driverId !== undefined) updatedData.driverId = body.driverId;
        
        // Log admin action
        if (session.role === "admin") {
          await db.insert(activityLogs).values({
            adminId: session.id,
            action: `Updated logistics order ${existingOrder.orderId}`,
            entityType: "order",
            entityId: parseInt(orderId),
            details: JSON.stringify(body),
          });
        }
        break;

      default:
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    updatedData.updatedAt = new Date();

    const [updatedOrder] = await db
      .update(logisticsOrders)
      .set(updatedData)
      .where(eq(logisticsOrders.id, parseInt(orderId)))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Update logistics order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE logistics order (admin only or farmer cancel)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;
    const [existingOrder] = await db
      .select()
      .from(logisticsOrders)
      .where(eq(logisticsOrders.id, parseInt(orderId)))
      .limit(1);

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Only allow cancellation of pending orders
    if (existingOrder.orderStatus !== "pending" && existingOrder.orderStatus !== "assigned") {
      return NextResponse.json(
        { success: false, error: "Can only cancel pending or assigned orders" },
        { status: 400 }
      );
    }

    // Update to cancelled instead of deleting for record keeping
    await db.update(logisticsOrders)
      .set({
        orderStatus: "cancelled",
        cancelledReason: "Cancelled by user",
        updatedAt: new Date(),
      })
      .where(eq(logisticsOrders.id, parseInt(orderId)));

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel logistics order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
