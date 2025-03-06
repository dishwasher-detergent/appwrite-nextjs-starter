"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { COOKIE_KEY, HOSTNAME } from "@/lib/constants";
import {
  ResetPasswordFormData,
  SignInFormData,
  SignUpFormData,
} from "./schemas";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ID, OAuthProvider } from "node-appwrite";

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

  return redirect("/signin");
}

export async function signInWithEmail(formData: SignInFormData) {
  const email = formData.email;
  const password = formData.password;

  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/app");
}

export async function signUpWithEmail(formData: SignUpFormData) {
  const name = formData.name;
  const email = formData.email;
  const password = formData.password;

  const { account } = await createAdminClient();

  try {
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/app");
}

export async function signUpWithGithub() {
  const { account } = await createAdminClient();
  const origin = (await headers()).get("origin");

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/api/auth/callback`,
    `${origin}/signup`
  );

  return redirect(redirectUrl);
}

export async function createPasswordRecovery(formData: ResetPasswordFormData) {
  const email = formData.email;

  const { account } = await createAdminClient();
  const origin = (await headers()).get("origin");

  try {
    await account.createRecovery(email, `${origin}/reset`);

    return {
      success: true,
      message: "Password recovery email sent",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function resetPassword(
  id: string,
  token: string,
  password: string
) {
  const { account } = await createAdminClient();

  try {
    await account.updateRecovery(id, token, password);
  } catch (err) {
    console.log(err);

    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/signin");
}
