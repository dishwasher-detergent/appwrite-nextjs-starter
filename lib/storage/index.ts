"use server";

import { getLoggedInUser } from "@/lib/auth";
import { createSessionClient } from "@/lib/server/appwrite";
import { AVATAR_BUCKET_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { Result } from "@/interfaces/result.interface";

import { ID, Models, Permission, Role } from "node-appwrite";

/**
 * Uploads a sample image.
 * @param {Object} params The parameters for creating a sample image
 * @param {string} [params.id] The ID of the sample
 * @param {File} params.data The image data
 * @param {string[]} [params.permissions] The permissions for the image (optional)
 * @returns {Promise<Result<Models.File>>} The file
 */
export async function uploadSampleImage({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: File;
  permissions?: string[];
}): Promise<Result<Models.File>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { storage } = await createSessionClient();

  permissions = [
    ...permissions,
    Permission.read(Role.user(user.$id)),
    Permission.write(Role.user(user.$id)),
  ];

  try {
    const response = await storage.createFile(
      SAMPLE_BUCKET_ID,
      id,
      data,
      permissions
    );

    return {
      success: true,
      message: "Sample image uploaded successfully.",
      data: response,
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
 * Deletes a sample image.
 * @param {string} id
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteSampleImage(id: string): Promise<Result<undefined>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { storage } = await createSessionClient();

  try {
    await storage.deleteFile(SAMPLE_BUCKET_ID, id);

    return {
      success: true,
      message: "Sample image successfully deleted.",
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
 * Uploads an avatar image.
 * @param {Object} params The parameters for creating a avatar image
 * @param {string} [params.id] The ID of the avatar
 * @param {File} params.data The image data
 * @param {string[]} [params.permissions] The permissions for the image (optional)
 * @returns {Promise<Result<Models.File>>} The file
 */
export async function uploadAvatarImage({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: File;
  permissions?: string[];
}): Promise<Result<Models.File>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { storage } = await createSessionClient();

  permissions = [
    ...permissions,
    Permission.read(Role.user(user.$id)),
    Permission.write(Role.user(user.$id)),
  ];

  try {
    const response = await storage.createFile(
      AVATAR_BUCKET_ID,
      id,
      data,
      permissions
    );

    return {
      success: true,
      message: "Avatar image uploaded successfully.",
      data: response,
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
 * Deletes an avatar image.
 * @param {string} id
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteAvatarImage(id: string): Promise<Result<undefined>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { storage } = await createSessionClient();

  try {
    await storage.deleteFile(AVATAR_BUCKET_ID, id);

    return {
      success: true,
      message: "Avatar image successfully deleted.",
    };
  } catch (err) {
    const error = err as Error;

    return {
      success: false,
      message: error.message,
    };
  }
}
