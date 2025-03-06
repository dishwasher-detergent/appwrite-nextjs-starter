"use server";

import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient } from "@/lib/server/appwrite";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";

export async function signUpWithEmail(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { account } = await createAdminClient();

  try {
    await account.create(ID.unique(), email, password);
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {
      success: true,
      message: "Sign up successful",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}
