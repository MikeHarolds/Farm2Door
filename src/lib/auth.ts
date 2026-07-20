import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
// Auth utilities for Farm2Market
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users, farmers, deliveryCompanies, drivers } from "@/db/schema";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET must be set in production. Generate one with: openssl rand -base64 32"
  );
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "farm2market-secret-key-change-in-production"
);

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: "farmer" | "delivery_partner" | "driver" | "admin";
  status: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(user: {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch (error) {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

// Get current session
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    console.log("========== GET SESSION ==========");
    console.log("Token exists:", !!token);

    if (!token) {
      console.log("No auth-token cookie found.");
      return null;
    }

    const session = await verifyToken(token);

    console.log("Decoded session:", session);

    return session;
  } catch (error) {
    console.error("getSession error:", error);
    return null;
  }
}

// export async function getSession(): Promise<SessionUser | null> {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("auth-token")?.value;

//     if (!token) return null;

//     return await verifyToken(token);
//   } catch {
//     return null;
//   }
// }

// Get authenticated user from DB with full profile data based on role
export async function getAuthenticatedUser() {
  const session = await getSession();

  if (!session) return null;

  // Get base user info
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.id))
    .limit(1);

  if (!user) return null;

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

  return { session, user, profile };
}
