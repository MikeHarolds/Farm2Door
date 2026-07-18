import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, farmers, drivers, deliveryCompanies, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    let query = db.select().from(users).orderBy(desc(users.createdAt));
    
    // Apply filters
    // Note: Drizzle dynamic filtering needs refinement - simplified for MVP
    
    const allUsers = await query;

    return NextResponse.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST update user status (activate/deactivate)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    // Find user
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    let newStatus;
    switch (action) {
      case "activate":
        newStatus = "active";
        break;
      case "deactivate":
        newStatus = "inactive";
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    const [updatedUser] = await db.update(users)
      .set({ status: newStatus as "active" | "inactive" | "pending", updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    // Log action
    await db.insert(activityLogs).values({
      adminId: session.id,
      action: `${action === "activate" ? "Activated" : "Deactivated"} ${user.role} user`,
      entityType: "user",
      entityId: userId,
      details: `Changed status to ${newStatus}`,
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User ${action}d successfully`,
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
