import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { deliveryCompanies, users, activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

// GET all delivery companies (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const allCompanies = await db
      .select()
      .from(deliveryCompanies)
      .orderBy(desc(deliveryCompanies.createdAt));

    // Get user info for each company
    const companiesWithUsers = await Promise.all(
      allCompanies.map(async (company) => {
        const [user] = await db.select().from(users).where(eq(users.id, company.userId)).limit(1);
        return {
          ...company,
          user: user ? { id: user.id, name: user.name, email: user.email, status: user.status } : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: companiesWithUsers,
    });
  } catch (error) {
    console.error("Get delivery companies error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST onboard new delivery company (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, name, email, phone, password, address, contactPerson, licenseNumber, fleetSize } = body;

    if (!companyName || !name || !email || !password) {
      return NextResponse.json({ success: false, error: "Required fields missing" }, { status: 400 });
    }

    // Check if email exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 });
    }

    // Hash password - dynamic import for server side
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user first
    const [newUser] = await db.insert(users).values({
      name,
      email,
      phone: phone || null,
      passwordHash,
      role: "delivery_partner",
      status: "active",
    }).returning();

    // Create company profile
    const [newCompany] = await db.insert(deliveryCompanies).values({
      userId: newUser.id,
      companyName,
      contactPerson: contactPerson || null,
      address: address || null,
      licenseNumber: licenseNumber || null,
      fleetSize: fleetSize || 0,
      isActive: true,
      capacityAvailable: true,
    }).returning();

    // Log action
    await db.insert(activityLogs).values({
      adminId: session.id,
      action: `Onboarded delivery company: ${companyName}`,
      entityType: "company",
      entityId: newCompany.id,
      details: `Contact: ${contactPerson || name}, Email: ${email}`,
    });

    return NextResponse.json({
      success: true,
      data: { ...newCompany, user: newUser },
      message: "Delivery company onboarded successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Onboard delivery company error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
