import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const userId = await verifyToken(req.cookies.get(COOKIE_NAME)?.value);
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!userId && !isAuthPage) return NextResponse.redirect(new URL("/login", req.url));
  if (userId && isAuthPage) return NextResponse.redirect(new URL("/groups", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/groups/:path*", "/wishlist/:path*", "/profile/:path*", "/login", "/register"] };
