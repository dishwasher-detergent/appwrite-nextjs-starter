"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { ID, Models, OAuthProvider, Permission, Role } from "node-appwrite";

import { AuthResponse, Response, Result } from "@/interfaces/result.interface";
import { User, UserData } from "@/interfaces/user.interface";
import { COOKIE_KEY, DATABASE_ID, USER_COLLECTION_ID } from "@/lib/constants";
import { createAdminClient, createSessionClient } from "@/lib/server/appwrite";
import { deleteAvatarImage, uploadAvatarImage } from "@/lib/storage";
import {
  ResetPasswordFormData,
  SignInFormData,
  SignUpFormData,
  UpdateProfileFormData,
} from "./schemas";

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
 * Get the current user
 * @returns {Promise<Result<User>} The current user
 */
export async function getUserData(): Promise<Result<User>> {
  return withAuth(async (user) => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async (id) => {
        try {
          const data = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            id
          );

          return {
            success: true,
            message: "Products successfully retrieved.",
            data: {
              ...user,
              ...data,
            },
          };
        } catch (err) {
          const error = err as Error;

          // This is where you would look to something like Splunk.
          console.error(error);

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["user"],
      {
        tags: ["user", `user:${user.$id}`],
        revalidate: 600,
      }
    )(user.$id);
  });
}

/**
 * Get the current user by ID
 * @param {string} id The user ID
 * @returns {Promise<Result<UserData>} The current user
 */
export async function getUserById(id: string): Promise<Result<UserData>> {
  return withAuth(async () => {
    const { database } = await createSessionClient();

    return unstable_cache(
      async (id) => {
        try {
          const data = await database.getDocument<UserData>(
            DATABASE_ID,
            USER_COLLECTION_ID,
            id
          );

          return {
            success: true,
            message: "Products successfully retrieved.",
            data,
          };
        } catch (err) {
          const error = err as Error;

          // This is where you would look to something like Splunk.
          console.error(error);

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["user", id],
      {
        tags: ["user", `user:${id}`],
        revalidate: 600,
      }
    )(id);
  });
}

/**
 * Updates the user's profile.
 * @param {Object} data The parameters for updating a user
 * @param {string} [data.name] The users name
 * @returns {Promise<Response>} A promise that resolves to an authentication response.
 */
export async function updateProfile({
  id,
  data,
}: {
  id: string;
  data: UpdateProfileFormData;
}): Promise<Response> {
  return withAuth(async (user) => {
    const { account, database } = await createSessionClient();

    try {
      const userData = await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        user.$id
      );

      if (data.image instanceof File) {
        if (userData.avatar) {
          await deleteAvatarImage(userData.avatar);
        }

        const image = await uploadAvatarImage({
          data: data.image,
        });

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = image.data?.$id;
      } else if (data.image === null && userData.avatar) {
        const image = await deleteAvatarImage(userData.avatar);

        if (!image.success) {
          throw new Error(image.message);
        }

        data.image = null;
      }

      await account.updateName(data.name);
      await database.updateDocument(DATABASE_ID, USER_COLLECTION_ID, id, {
        avatar: data.image,
        about: data.about,
      });

      revalidateTag("user");
      revalidateTag("user-logs");

      return {
        success: true,
        message: "Profile updated successfully",
      };
    } catch (err) {
      const error = err as Error;

      // This is where you would look to something like Splunk.
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Get a list of logs
 * @returns {Promise<Result<Models.LogList>>} The list of logs
 */
export async function getUserLogs(): Promise<Result<Models.LogList>> {
  return withAuth(async () => {
    const { account } = await createSessionClient();

    return unstable_cache(
      async () => {
        try {
          const logs = await account.listLogs();

          return {
            success: true,
            message: "Products successfully retrieved.",
            data: logs,
          };
        } catch (err) {
          const error = err as Error;

          // This is where you would look to something like Splunk.
          console.error(error);

          return {
            success: false,
            message: error.message,
          };
        }
      },
      ["user-logs"],
      {
        tags: ["user-logs"],
        revalidate: 600,
      }
    )();
  });
}

/**
 * Logs out the currently logged-in user.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is logged in, false otherwise.
 */
export async function logOut(): Promise<boolean> {
  await deleteSession();

  return redirect("/signin");
}

export async function deleteSession(): Promise<void> {
  const { account } = await createSessionClient();

  account.deleteSession("current");
  (await cookies()).delete(COOKIE_KEY);

  revalidateTag("logged_in_user");
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

    revalidateTag("logged_in_user");

    (await cookies()).set(COOKIE_KEY, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk.
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/app", RedirectType.push);
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

  revalidateTag("logged_in_user");

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
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk.
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/app");
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
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk.
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/reset");
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
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk.
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }

  return redirect("/signin");
}

/**
 * Creates user data in the database if it doesn't already exist.
 * @param userId the user ID
 * @param name the user's name
 * @returns {Promise<Result<UserData>>} A promise that resolves to a result object indicating success or failure.
 */
export async function createUserData(
  userId: string
): Promise<Result<UserData>> {
  return withAuth(async (user) => {
    const { database } = await createAdminClient();

    try {
      await database.getDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        userId
      );

      return {
        success: true,
        message: "User data already exists.",
      };
    } catch {
      await database.createDocument<UserData>(
        DATABASE_ID,
        USER_COLLECTION_ID,
        userId,
        {
          name: user.name,
          avatar: null,
        },
        [
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
          Permission.read(Role.users()),
        ]
      );

      return {
        success: true,
        message: "User data successfully created.",
      };
    }
  });
}

type AuthenticatedFunction<T> = (
  user: Models.User<Models.Preferences>
) => Promise<Result<T>>;

export async function withAuth<T>(
  fn: AuthenticatedFunction<T>
): Promise<Result<T>> {
  return (async () => {
    const user = await getLoggedInUser();

    if (!user) {
      return {
        success: false,
        message: "You must be logged in to perform this action.",
      };
    }

    return fn(user);
  })();
}
