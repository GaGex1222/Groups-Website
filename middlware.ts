import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session) {
    // If no session exists, allow access to login and register
    return NextResponse.next();
  }

  // If session exists, redirect them away from login and register pages
  const url = request.nextUrl.clone();
  if (url.pathname === "/login" || url.pathname === "/register") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register", "/login"]
};
