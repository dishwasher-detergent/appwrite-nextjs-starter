"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { Result } from "@/interfaces/result.interface";
import { Sample } from "@/interfaces/sample.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";
import { getLoggedInUser } from "@/lib/auth";
import {
  DATABASE_ID,
  SAMPLE_COLLECTION_ID,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteSampleImage, uploadSampleImage } from "@/lib/storage";
import { AddSampleFormData, EditSampleFormData } from "./schemas";

/**
 * Get a list of samples
 * @param {string[]} queries The queries to filter the samples
 * @returns {Promise<Result<Models.DocumentList<Sample>>>} The list of samples
 */
export async function listSamples(
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

    const userIds = samples.documents.map((sample) => sample.userId);
    const uniqueUserIds = Array.from(new Set(userIds));

    const teamIds = samples.documents.map((sample) => sample.teamId);
    const uniqueTeamIds = Array.from(new Set(teamIds));

    const users = await database.listDocuments<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      [
        Query.equal("$id", uniqueUserIds),
        Query.select(["$id", "name", "avatar"]),
      ]
    );

    const teams = await database.listDocuments<UserData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      [
        Query.equal("$id", uniqueTeamIds),
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

    const teamMap = teams.documents.reduce<Record<string, TeamData>>(
      (acc, team) => {
        if (team) {
          acc[team.$id] = team;
        }
        return acc;
      },
      {}
    );

    const newSamples = samples.documents.map((sample) => ({
      ...sample,
      user: userMap[sample.userId],
      team: teamMap[sample.teamId],
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

        const userRes = await database.getDocument<UserData>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          sample.userId,
          [Query.select(["$id", "name", "avatar"])]
        );

        const teamRes = await database.getDocument<TeamData>(
          DATABASE_ID,
          TEAM_COLLECTION_ID,
          sample.teamId,
          [Query.select(["$id", "name", "avatar"])]
        );

        return {
          success: true,
          message: "Sample successfully retrieved.",
          data: {
            ...sample,
            user: userRes,
            team: teamRes,
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
      tags: ["samples", `sample:${sampleId}`],
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
    Permission.read(Role.team(data.teamId)),
  ];

  try {
    if (data.image instanceof File) {
      const image = await uploadSampleImage({
        data: data.image,
        permissions: [Permission.read(Role.team(data.teamId))],
      });

      if (!image.success) {
        throw new Error(image.message);
      }

      data.image = image.data?.$id;
    }

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

    const userRes = await database.getDocument<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      sample.userId,
      [Query.select(["$id", "name", "avatar"])]
    );

    const teamRes = await database.getDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      sample.teamId,
      [Query.select(["$id", "name", "avatar"])]
    );

    revalidateTag("samples");

    return {
      success: true,
      message: "Sample successfully created.",
      data: {
        ...sample,
        user: userRes,
        team: teamRes,
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
    const existingSample = await database.getDocument<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      id
    );

    if (data.image instanceof File) {
      if (existingSample.image) {
        await deleteSampleImage(existingSample.image);
      }

      const image = await uploadSampleImage({
        data: data.image,
      });

      if (!image.success) {
        throw new Error(image.message);
      }

      data.image = image.data?.$id;
    } else if (data.image === null && existingSample.image) {
      const image = await deleteSampleImage(existingSample.image);

      if (!image.success) {
        throw new Error(image.message);
      }

      data.image = null;
    }

    const sample = await database.updateDocument<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      id,
      {
        ...data,
        userId: user.$id,
      },
      permissions
    );

    const userRes = await database.getDocument<UserData>(
      DATABASE_ID,
      USER_COLLECTION_ID,
      sample.userId,
      [Query.select(["$id", "name", "avatar"])]
    );

    const teamRes = await database.getDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      sample.teamId,
      [Query.select(["$id", "name", "avatar"])]
    );

    revalidateTag("samples");
    revalidateTag(`sample:${id}`);

    return {
      success: true,
      message: "Sample successfully updated.",
      data: {
        ...sample,
        user: userRes,
        team: teamRes,
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
    const sample = await database.getDocument<Sample>(
      DATABASE_ID,
      SAMPLE_COLLECTION_ID,
      id
    );

    if (sample.image) {
      const image = await deleteSampleImage(sample.image);

      if (!image.success) {
        throw new Error(image.message);
      }
    }

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

export async function createUserData(
  id: string,
  name: string
): Promise<Result<UserData>> {
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
        name: name,
        avatar: null,
      },
      [
        Permission.read(Role.user(id)),
        Permission.write(Role.user(id)),
        Permission.read(Role.users()),
      ]
    );

    return {
      success: true,
      message: "User data successfully created.",
    };
  }
}
