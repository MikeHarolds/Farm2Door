import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { drivers, deliveryCompanies, users as userTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET drivers for a delivery partner
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "delivery_partner") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get company profile
    const [company] = await db
      .select()
      .from(deliveryCompanies)
      .where(eq(deliveryCompanies.userId, session.id))
      .limit(1);

    if (!company) {
      return NextResponse.json({ success: false, error: "Company profile not found" }, { status: 404 });
    }

    // Get all drivers for this company
    const companyDrivers = await db
      .select({
        driver: drivers,
        userInfo: {
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          phone: userTable.phone,
          status: userTable.status,
        },
      })
      .from(drivers)
      .innerJoin(userTable, eq(drivers.userId, userTable.id))
      .where(eq(drivers.deliveryCompanyId, company.id))
      .orderBy(desc(drivers.createdAt));

    return NextResponse.json({
      success: true,
      data: companyDrivers,
    });
  } catch (error) {
    console.error("Get drivers error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
