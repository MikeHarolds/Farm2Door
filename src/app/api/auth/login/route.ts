import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, farmers, deliveryCompanies, drivers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(validatedData.password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is active (except admins can always login)
    if (user.status !== "active" && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Account is not active. Please contact support." },
        { status: 403 }
      );
    }

    // Get role-specific profile
    let profile = null;
    switch (user.role) {
      case "farmer":
        [profile] = await db
          .select()
          .from(farmers)
          .where(eq(farmers.userId, user.id))
          .limit(1);
        break;
      case "delivery_partner": {
        [profile] = await db
          .select()
          .from(deliveryCompanies)
          .where(eq(deliveryCompanies.userId, user.id))
          .limit(1);
        break;
      }
      case "driver": {
        [profile] = await db
          .select()
          .from(drivers)
          .where(eq(drivers.userId, user.id))
          .limit(1);
        break;
      }
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        profile,
      },
      message: "Login successful",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
