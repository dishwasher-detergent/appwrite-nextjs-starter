"use server";

import { ID, Models, Permission, Role } from "node-appwrite";

import { Result } from "@/interfaces/result.interface";
import { getLoggedInUser } from "@/lib/auth";
import { Sample } from "@/interfaces/sample.interface";
import { createSessionClient } from "@/lib/server/appwrite";
import {
  DATABASE_ID,
  SAMPLE_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { AddSampleFormData, EditSampleFormData } from "./schemas";
import { User, UserData } from "@/interfaces/user.interface";

/**
 * Get the current user
 * @returns {Promise<Result<User>} The current user
 */
export async function getUser(): Promise<Result<User>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    const data = await database.getDocument<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      user.$id
    );

    return {
      success: true,
      message: "Samples successfully retrieved.",
      data: {
        ...user,
        ...data,
      },
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
 * Get a list of samples
 * @param {string[]} queries The queries to filter the samples
 * @returns {Promise<Result<Models.DocumentList<Sample>>} The list of samples
 */
export async function getSamples(
  queries: string[] = []
): Promise<Result<Models.DocumentList<Sample>>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    const samples = await database.listDocuments<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      queries
    );

    return {
      success: true,
      message: "Samples successfully retrieved.",
      data: samples,
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
 * Get a sample by ID
 * @param {string} sampleId The ID of the sample
 * @param {string[]} queries The queries to filter the sample
 * @returns {Promise<Result<Sample>>} The sample
 */
export async function getSampleById(
  sampleId: string,
  queries: string[] = []
): Promise<Result<Sample>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    const sample = await database.getDocument<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      sampleId,
      queries
    );

    return {
      success: true,
      message: "Sample successfully retrieved.",
      data: sample,
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
 * Create a sample
 * @param {Object} params The parameters for creating a sample
 * @param {string} [params.id] The ID of the sample (optional)
 * @param {z.infer<typeof addSampleSchema>} params.data The sample data
 * @param {string[]} [params.permissions] The permissions for the sample (optional)
 * @returns {Promise<Result<Sample>>} The created sample
 */
export async function createSample({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: AddSampleFormData;
  permissions?: string[];
}): Promise<Result<Sample>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  permissions = [
    ...permissions,
    Permission.read(Role.user(user.$id)),
    Permission.write(Role.user(user.$id)),
  ];

  try {
    const sample = await database.createDocument<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      id,
      data,
      permissions
    );

    return {
      success: true,
      message: "Sample successfully created.",
      data: sample,
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
 * Update a sample
 * @param {Object} params The parameters for creating a sample
 * @param {string} [params.id] The ID of the sample
 * @param {z.infer<typeof editSampleSchema>} params.data The sample data
 * @param {string[]} [params.permissions] The permissions for the sample (optional)
 * @returns {Promise<Result<Sample>>} The updated sample
 */
export async function updateSample({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditSampleFormData;
  permissions?: string[];
}): Promise<Result<Sample>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    const sample = await database.updateDocument<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      id,
      data,
      permissions
    );

    return {
      success: true,
      message: "Sample successfully updated.",
      data: sample,
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
 * Delete a sample
 * @param {string} id The ID of the sample
 * @returns {Promise<Result<Sample>>} The deleted sample
 */
export async function deleteSample(id: string): Promise<Result<Sample>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    await database.deleteDocument(DATABASE_ID, SAMPLE_COLLECTION_ID, id);

    return {
      success: true,
      message: "Sample successfully deleted.",
    };
  } catch (err) {
    const error = err as Error;

    return {
      success: false,
      message: error.message,
    };
  }
}
