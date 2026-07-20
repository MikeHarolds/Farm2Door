import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });
}

export async function GET(request: Request) {
  await clearAuthCookie();

  return NextResponse.redirect(new URL("/login", request.url));
}
