import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activityLogs, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET all activity logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const logs = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(100);

    // Get admin names for each log
    const logsWithAdmins = await Promise.all(
      logs.map(async (log) => {
        let adminName = "System";
        if (log.adminId) {
          const [admin] = await db.select().from(users).where(eq(users.id, log.adminId)).limit(1);
          if (admin) adminName = admin.name;
        }
        return { ...log, adminName };
      })
    );

    return NextResponse.json({
      success: true,
      data: logsWithAdmins,
    });
  } catch (error) {
    console.error("Get activity logs error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
