import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/verify-email", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname === route);

  // check session cookie — your backend sets this on login
  const token = request.cookies.get("accessToken")?.value;

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (pathname === "/login" || pathname === "/signup")) {
    // we don't know role here without calling backend
    // so redirect to /dashboard, let the page handle admin redirect
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};