import { NextRequest, NextResponse } from "next/server";

import { createUserData } from "@/lib/auth";
import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient } from "@/lib/server/appwrite";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.redirect("/signin");
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  // Set the cookie in the response headers
  const response = NextResponse.redirect(`${request.nextUrl.origin}/app`);

  response.cookies.set(COOKIE_KEY, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  await createUserData(session.userId);

  return response;
}
