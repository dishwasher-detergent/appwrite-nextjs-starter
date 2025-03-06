"use server";

import { COOKIE_KEY } from "@/lib/constants";
import { createAdminClient } from "@/lib/server/appwrite";

import { cookies } from "next/headers";

export async function signInWithEmail(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}
