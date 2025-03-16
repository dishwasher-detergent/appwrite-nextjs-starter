"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { AuthResponse, Result } from "@/interfaces/result.interface";
import { Sample } from "@/interfaces/sample.interface";
import { User, UserData } from "@/interfaces/user.interface";
import { getLoggedInUser } from "@/lib/auth";
import {
  DATABASE_ID,
  SAMPLE_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import {
  AddSampleFormData,
  EditSampleFormData,
  UpdateProfileFormData,
} from "./schemas";

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

  return unstable_cache(
    async () => {
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
    },
    ["user"],
    {
      tags: ["user"],
      revalidate: 600,
    }
  )();
}

/**
 * Get the current user by ID
 * @param {string} id The user ID
 * @returns {Promise<Result<UserData>} The current user
 */
export async function getUserById(id: string): Promise<Result<UserData>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  return unstable_cache(
    async () => {
      try {
        const data = await database.getDocument<UserData>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          id
        );

        return {
          success: true,
          message: "Samples successfully retrieved.",
          data,
        };
      } catch (err) {
        const error = err as Error;

        return {
          success: false,
          message: error.message,
        };
      }
    },
    ["user", id],
    {
      tags: ["user", `user-${id}`],
      revalidate: 600,
    }
  )();
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

    revalidateTag("user");
    revalidateTag("user-logs");

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

  return unstable_cache(
    async () => {
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
    },
    ["user-logs"],
    {
      tags: ["user-logs"],
      revalidate: 600,
    }
  )();
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

  return unstable_cache(
    async () => {
      try {
        const samples = await database.listDocuments<Sample>(
          DATABASE_ID,
          SAMPLE_COLLECTION_ID,
          queries
        );

        const userIds = samples.documents.map((sample) => sample.userId);
        const uniqueUserIds = Array.from(new Set(userIds));

        const users = await database.listDocuments<UserData>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          [
            Query.equal("$id", uniqueUserIds),
            Query.select(["$id", "name", "avatar"]),
          ]
        );

        const userMap = users.documents.reduce<Record<string, UserData>>(
          (acc, user) => {
            if (user) {
              acc[user.$id] = user;
            }
            return acc;
          },
          {}
        );

        const newSamples = samples.documents.map((sample) => ({
          ...sample,
          user: userMap[sample.userId],
        }));

        samples.documents = newSamples;

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
    },
    ["samples"],
    {
      tags: ["samples"],
      revalidate: 600,
    }
  )();
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

  return unstable_cache(
    async () => {
      try {
        const sample = await database.getDocument<Sample>(
          DATABASE_ID,
          SAMPLE_COLLECTION_ID,
          sampleId,
          queries
        );

        const user = await database.getDocument<UserData>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          sample.userId,
          [Query.select(["$id", "name", "avatar"])]
        );

        return {
          success: true,
          message: "Sample successfully retrieved.",
          data: {
            ...sample,
            user: user,
          },
        };
      } catch (err) {
        const error = err as Error;

        return {
          success: false,
          message: error.message,
        };
      }
    },
    ["sample", sampleId],
    {
      tags: ["samples", `sample-${sampleId}`],
      revalidate: 600,
    }
  )();
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
      {
        ...data,
        userId: user.$id,
      },
      permissions
    );

    revalidateTag("samples");

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

    revalidateTag("samples");
    revalidateTag(`sample-${id}`);

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

    revalidateTag("samples");

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
  } catch {
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
