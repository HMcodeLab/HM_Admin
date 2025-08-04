// middleware.ts
import { roleRoutes } from "@/utils/roleRoutes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const token = request.cookies.get("adminToken")?.value || null;

  // Agar login nahi hai
  if (!token && request.nextUrl.pathname !== "/auth/sign-in") {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // Agar token hai, role extract karo
  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );
      const role = payload.role; // ✅ token me role hona chahiye

      const allowedRoutes = roleRoutes[role] || [];

      // Agar route allowed list me nahi hai
      if (
        !allowedRoutes.some((route) =>
          request.nextUrl.pathname.startsWith(route),
        )
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (err) {
      console.error("Invalid token:", err);
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Protect all except static
};
