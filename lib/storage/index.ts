"use server";

import { getLoggedInUser } from "@/lib/auth";
import { createSessionClient } from "@/lib/server/appwrite";
import { SAMPLE_BUCKET_ID } from "@/lib/constants";
import { Result } from "@/interfaces/result.interface";

import { ID, Models, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

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

export async function deleteSampleImage(id: string): Promise<Result<any>> {
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
