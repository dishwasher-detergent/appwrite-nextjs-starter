"use server";

import { createSessionClient } from "@/lib/server/appwrite";
import { COOKIE_KEY } from "@/lib/constants";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}

export async function logOut() {
  const { account } = await createSessionClient();

  account.deleteSession("current");
  (await cookies()).delete(COOKIE_KEY);

  redirect("/login");
}
