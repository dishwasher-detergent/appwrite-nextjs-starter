import { cookies } from "next/headers";
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

  (await cookies()).set(COOKIE_KEY, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  await createUserData(session.userId, session.providerUid.split("@")[0]);

  return NextResponse.redirect(`${request.nextUrl.origin}/app`);
}
