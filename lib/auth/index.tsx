"use server";

import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { COOKIE_KEY } from "@/lib/constants";
import { createUserData } from "@/lib/db";
import { AuthResponse } from "@/interfaces/result.interface";
import {
  ResetPasswordFormData,
  SignInFormData,
  SignUpFormData,
} from "./schemas";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ID, Models, OAuthProvider } from "node-appwrite";

/**
 * Retrieves the currently logged-in user.
 *
 * @returns {Promise<Models.User<Models.Preferences> | null>} A promise that resolves to the account information
 * of the logged-in user, or null if no user is logged in.
 */
export async function getLoggedInUser(): Promise<Models.User<Models.Preferences> | null> {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch {
    return null;
  }
}

/**
 * Logs out the currently logged-in user.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is logged in, false otherwise.
 */
export async function logOut(): Promise<boolean> {
  const { account } = await createSessionClient();

  account.deleteSession("current");
  (await cookies()).delete(COOKIE_KEY);

  return redirect("/signin");
}

/**
 * Signs in a user with an email and password.
 * @param {SignInFormData} formData The sign-in form data.
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function signInWithEmail(
  formData: SignInFormData
): Promise<AuthResponse> {
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

    return {
      success: true,
      message: "Signed in successfully",
      redirect: "/app",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Signs up a user with an email and password.
 * @param {SignUpFormData} formData The sign-up form data.
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function signUpWithEmail(
  formData: SignUpFormData
): Promise<AuthResponse> {
  const name = formData.name;
  const email = formData.email;
  const password = formData.password;

  const { account } = await createAdminClient();

  try {
    const id = ID.unique();
    await account.create(id, email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    await createUserData(session.userId);

    return {
      success: true,
      message: "Account created successfully",
      redirect: "/app",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Signs up a user with GitHub OAuth.
 * @returns {Promise<void>} A promise that resolves to a redirect to the GitHub OAuth page.
 */
export async function signUpWithGithub(): Promise<void> {
  const { account } = await createAdminClient();
  const origin = (await headers()).get("origin");

  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/api/auth/callback`,
    `${origin}/signup`
  );

  return redirect(redirectUrl);
}

/**
 * Signs up a user with Google OAuth.
 * @param {ResetPasswordFormData} formData
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function createPasswordRecovery(
  formData: ResetPasswordFormData
): Promise<AuthResponse> {
  const email = formData.email;

  const { account } = await createAdminClient();
  const origin = (await headers()).get("origin");

  try {
    await account.createRecovery(email, `${origin}/reset`);

    return {
      success: true,
      message: "A recovery email has been sent to your inbox",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Resets a user's password.
 * @param {string} id
 * @param {string} token
 * @param {string} password
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function resetPassword(
  id: string,
  token: string,
  password: string
): Promise<AuthResponse> {
  const { account } = await createAdminClient();

  try {
    await account.updateRecovery(id, token, password);

    return {
      success: true,
      message: "Password reset successfully",
      redirect: "/signin",
    };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      message: error.message,
    };
  }
}
