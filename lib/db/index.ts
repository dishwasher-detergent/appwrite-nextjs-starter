"use server";

import { ID, Models, Permission, Role } from "node-appwrite";

import { AuthResponse, Result } from "@/interfaces/result.interface";
import { getLoggedInUser } from "@/lib/auth";
import { Sample } from "@/interfaces/sample.interface";
import { createSessionClient } from "@/lib/server/appwrite";
import {
  DATABASE_ID,
  SAMPLE_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import {
  AddSampleFormData,
  EditSampleFormData,
  UpdateProfileFormData,
} from "./schemas";
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
 * Updates the user's profile.
 * @param {Object} data The parameters for updating a user
 * @param {string} [data.name] The users name
 * @returns {Promise<AuthResponse>} A promise that resolves to an authentication response.
 */
export async function updateProfile({
  id,
  data,
}: {
  id: string;
  data: UpdateProfileFormData;
}): Promise<AuthResponse> {
  const { account, database } = await createSessionClient();

  try {
    await account.updateName(data.name);
    await database.updateDocument(DATABASE_ID, USER_COLLECTION_ID, id, {
      avatar: data.image,
      about: data.about,
    });

    return {
      success: true,
      message: "Profile updated successfully",
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
 * Get a list of logs
 * @returns {Promise<Result<Models.LogList>>} The list of logs
 */
export async function getUserLogs(): Promise<Result<Models.LogList>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { account } = await createSessionClient();

  try {
    const logs = await account.listLogs();

    return {
      success: true,
      message: "Samples successfully retrieved.",
      data: logs,
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
 * @param {AddSampleFormData} params.data The sample data
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
 * @param {EditSampleFormData} params.data The sample data
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

export async function createUserData(id: string): Promise<Result<UserData>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  try {
    await database.getDocument<UserData>(DATABASE_ID, USER_COLLECTION_ID, id);

    return {
      success: true,
      message: "User data already exists.",
    };
  } catch (err) {
    console.log(err);

    await database.createDocument<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      id,
      {
        avatar: null,
      }
    );

    return {
      success: true,
      message: "User data successfully created.",
    };
  }
}
