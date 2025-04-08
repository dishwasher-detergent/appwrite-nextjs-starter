"use server";

import { NextRequest, NextResponse } from "next/server";

import { createSessionClient } from "@/lib/server/appwrite";
import { COOKIE_KEY } from "@/lib/constants";

const protectedRoutes = ["/app"];
const publicRoutes = ["/signin", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookieSession = req.cookies.get(COOKIE_KEY)?.value;

  let user = null;
  
  try {
    const { account } = await createSessionClient(cookieSession);
    user = await account.get();
  } catch {
    user = null;
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/app", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
