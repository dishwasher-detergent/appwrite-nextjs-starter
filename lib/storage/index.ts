"use server";

import { Result } from "@/interfaces/result.interface";
import { withAuth } from "@/lib/auth";
import { AVATAR_BUCKET_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";

import { ID, Models, Permission, Role } from "node-appwrite";

/**
 * Uploads a product image.
 * @param {Object} params The parameters for creating a product image
 * @param {string} [params.id] The ID of the product
 * @param {File} params.data The image data
 * @param {string[]} [params.permissions] The permissions for the image (optional)
 * @returns {Promise<Result<Models.File>>} The file
 */
export async function uploadProductImage({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: File;
  permissions?: string[];
}): Promise<Result<Models.File>> {
  return withAuth(async (user) => {
    const { storage } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.any()),
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
        message: "Product image uploaded successfully.",
        data: response,
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
}

/**
 * Deletes a product image.
 * @param {string} id
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteProductImage(
  id: string
): Promise<Result<undefined>> {
  return withAuth(async () => {
    const { storage } = await createSessionClient();

    try {
      await storage.deleteFile(SAMPLE_BUCKET_ID, id);

      return {
        success: true,
        message: "Product image successfully deleted.",
      };
    } catch (err) {
      const error = err as Error;

      return {
        success: false,
        message: error.message,
      };
    }
  });
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
  return withAuth(async (user) => {
    const { storage } = await createSessionClient();

    permissions = [
      ...permissions,
      Permission.read(Role.users()),
      Permission.read(Role.user(user.$id)),
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.any()),
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
  });
}

/**
 * Deletes an avatar image.
 * @param {string} id
 * @returns {Promise<Result<undefined>>} A promise that resolves to a result object.
 */
export async function deleteAvatarImage(
  id: string
): Promise<Result<undefined>> {
  return withAuth(async () => {
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
  });
}
