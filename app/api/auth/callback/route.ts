import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { COOKIE_KEY } from "@/lib/constants";
import { createUserData } from "@/lib/db";
import { createAdminClient } from "@/lib/server/appwrite";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.redirect("/signin");
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);
  const user = await account.get();

  (await cookies()).set(COOKIE_KEY, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  await createUserData(session.userId, user.name);

  return NextResponse.redirect(`${request.nextUrl.origin}/app`);
}
