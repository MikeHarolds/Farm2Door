import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, farmers, deliveryCompanies, drivers } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import {
  farmerRegistrationSchema,
  deliveryPartnerRegistrationSchema,
  driverRegistrationSchema,
} from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;

    // Validate based on role
    let validatedData;
    switch (role) {
      case "farmer":
        validatedData = farmerRegistrationSchema.parse(body);
        break;
      case "delivery_partner":
        validatedData = deliveryPartnerRegistrationSchema.parse(body);
        break;
      case "driver":
        validatedData = driverRegistrationSchema.parse(body);
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid role specified" },
          { status: 400 }
        );
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        passwordHash,
        role,
        status: role === "admin" ? "active" : "pending",
      })
      .returning();

    // Create role-specific profile
    let profile = null;
    switch (role) {
      case "farmer": {
        const farmerData = validatedData as any;
        [profile] = await db
          .insert(farmers)
          .values({
            userId: newUser.id,
            farmName: farmerData.farmName,
            farmLocation: farmerData.farmLocation,
            farmSize: farmerData.farmSize || null,
            farmType: farmerData.farmType || null,
          })
          .returning();
        break;
      }
      case "delivery_partner": {
        const partnerData = validatedData as any;
        [profile] = await db
          .insert(deliveryCompanies)
          .values({
            userId: newUser.id,
            companyName: partnerData.companyName,
            contactPerson: partnerData.contactPerson || null,
            address: partnerData.address || null,
            licenseNumber: partnerData.licenseNumber || null,
          })
          .returning();
        break;
      }
      case "driver": {
        const driverData = validatedData as any;
        [profile] = await db
          .insert(drivers)
          .values({
            userId: newUser.id,
            vehicleType: driverData.vehicleType || null,
            vehicleNumber: driverData.vehicleNumber || null,
            licenseNumber: driverData.licenseNumber || null,
            deliveryCompanyId: driverData.deliveryCompanyId || null,
          })
          .returning();
        break;
      }
    }

    // Create JWT token
    const token = await createToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as string,
      status: newUser.status,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
          },
          profile,
        },
        message: "Registration successful",
      },
      { status: 201 }
    );
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

    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
