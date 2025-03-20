"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role } from "node-appwrite";

import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { UserData, UserMemberData } from "@/interfaces/user.interface";
import { createUserData, getLoggedInUser } from "@/lib/auth";
import {
  DATABASE_ID,
  HOSTNAME,
  MAX_TEAM_LIMIT,
  TEAM_COLLECTION_ID,
  USER_COLLECTION_ID,
} from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { deleteAvatarImage, uploadAvatarImage } from "@/lib/storage";
import { AddTeamFormData, EditTeamFormData } from "./schemas";

/**
 * Get a team by ID
 * @param {string} id The team ID
 * @returns {Promise<Result<TeamData>} The team
 */
export async function getTeamById(id: string): Promise<Result<TeamData>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  return unstable_cache(
    async (id) => {
      try {
        const data = await database.getDocument<TeamData>(
          DATABASE_ID,
          TEAM_COLLECTION_ID,
          id
        );

        const memberships = await team.listMemberships(data.$id);

        const userIds = memberships.memberships.map((member) => member.userId);
        const uniqueUserIds = Array.from(new Set(userIds));

        const users = await database.listDocuments<UserData>(
          DATABASE_ID,
          USER_COLLECTION_ID,
          [
            Query.equal("$id", uniqueUserIds),
            Query.select(["$id", "name", "avatar"]),
          ]
        );

        const usersMembershipData: UserMemberData[] = users.documents.map(
          (user) => {
            const member = memberships.memberships.filter(
              (member) => member.userId === user.$id
            )[0];
            return {
              ...user,
              roles: member.roles,
              confirmed: member.confirm,
              joinedAt: member.joined,
            };
          }
        );

        return {
          success: true,
          message: "Team successfully retrieved.",
          data: {
            ...data,
            members: usersMembershipData,
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
    ["team", id],
    {
      tags: ["team", `team:${id}`],
      revalidate: 600,
    }
  )(id);
}

/**
 * List all teams
 * @returns {Promise<Result<TeamData[]>} The teams
 */
export async function listTeams(): Promise<Result<TeamData[]>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database } = await createSessionClient();

  return unstable_cache(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (userId) => {
      try {
        const data = await database.listDocuments<TeamData>(
          DATABASE_ID,
          TEAM_COLLECTION_ID
        );

        return {
          success: true,
          message: "Teams successfully retrieved.",
          data: data.documents,
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
    ["teams"],
    {
      tags: ["teams", `teams:user-${user.$id}`],
      revalidate: 600,
    }
  )(user.$id);
}

/**
 * Create a team
 * @param {Object} params The parameters for creating a team
 * @param {string} [params.id] The ID of the team (optional)
 * @param {AddTeamFormData} params.data The team data
 * @param {string[]} [params.permissions] The permissions for the team (optional)
 * @returns {Promise<Result<TeamData>>} The created team
 */
export async function createTeam({
  id = ID.unique(),
  data,
  permissions = [],
}: {
  id?: string;
  data: AddTeamFormData;
  permissions?: string[];
}): Promise<Result<TeamData>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  permissions = [
    ...permissions,
    Permission.read(Role.user(user.$id)),
    Permission.write(Role.user(user.$id)),
  ];

  try {
    const existingTeams = await database.listDocuments<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      [Query.select(["$id"])]
    );

    if (existingTeams.total >= MAX_TEAM_LIMIT) {
      throw new Error(
        `You have reached the maximum amount of teams allowed. (${MAX_TEAM_LIMIT})`
      );
    }

    const teamResponse = await team.create(id, data.name, [
      ADMIN_ROLE,
      OWNER_ROLE,
    ]);

    permissions = [
      ...permissions,
      Permission.read(Role.team(teamResponse.$id)),
      Permission.write(Role.team(teamResponse.$id, ADMIN_ROLE)),
    ];

    const teamData = await database.createDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      teamResponse.$id,
      {
        name: data.name,
        about: data.about,
      },
      permissions
    );

    revalidateTag("teams");

    return {
      success: true,
      message: "Team successfully created.",
      data: teamData,
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
}

/**
 * Update a team
 * @param {Object} params The parameters for creating a team
 * @param {string} [params.id] The ID of the team
 * @param {EditTeamFormData} params.data The team data
 * @param {string[]} [params.permissions] The permissions for the team (optional)
 * @returns {Promise<Result<TeamData>>} The updated team
 */
export async function updateTeam({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: EditTeamFormData;
  permissions?: string[];
}): Promise<Result<TeamData>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  try {
    await checkUserRole(id, user.$id, [ADMIN_ROLE]);

    const existingTeamData = await database.getDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      id
    );

    if (data.image instanceof File) {
      if (existingTeamData.avatar) {
        await deleteAvatarImage(existingTeamData.avatar);
      }

      const image = await uploadAvatarImage({
        data: data.image,
      });

      if (!image.success) {
        throw new Error(image.message);
      }

      data.image = image.data?.$id;
    } else if (data.image === null && existingTeamData.avatar) {
      const image = await deleteAvatarImage(existingTeamData.avatar);

      if (!image.success) {
        throw new Error(image.message);
      }

      data.image = null;
    }

    await team.updateName(id, data.name);

    const teamData = await database.updateDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      id,
      {
        name: data.name,
        about: data.about,
        avatar: data.image,
      },
      permissions
    );

    revalidateTag("teams");
    revalidateTag(`team:${id}`);

    return {
      success: true,
      message: "Team successfully updated.",
      data: teamData,
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
}

/**
 * Delete a team
 * @param {string} id The ID of the team
 * @returns {Promise<Result<TeamData>>} The deleted team
 */
export async function deleteTeam(id: string): Promise<Result<TeamData>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  try {
    await checkUserRole(id, user.$id, [ADMIN_ROLE]);

    const existingTeamData = await database.getDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      id
    );

    if (existingTeamData.avatar) {
      const image = await deleteAvatarImage(existingTeamData.avatar);

      if (!image.success) {
        throw new Error(image.message);
      }
    }

    await team.delete(id);
    await database.deleteDocument(DATABASE_ID, TEAM_COLLECTION_ID, id);

    revalidateTag("teams");

    return {
      success: true,
      message: "Team successfully deleted.",
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
}

/**
 * Leave a team
 * @param teamId The team ID
 * @returns {Promise<Result<string>>} The ID of another team the user is in.
 */
export async function leaveTeam(teamId: string): Promise<Result<string>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  try {
    const memberships = await team.listMemberships(teamId, [
      Query.equal("userId", user.$id),
    ]);

    const membership = memberships.memberships[0];

    if (!membership) {
      throw new Error("You are not a member of this team.");
    }

    if (membership.roles.includes(OWNER_ROLE)) {
      throw new Error("You cannot leave a team you own.");
    }

    await team.deleteMembership(teamId, membership.$id);

    const data = await database.listDocuments<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(1)]
    );

    revalidateTag("teams");
    revalidateTag(`team:${teamId}`);

    if (data.documents.length > 0) {
      return {
        success: true,
        message: `You've left ${teamId}!`,
        data: data.documents[0].$id,
      };
    }

    return {
      success: true,
      message: `You've left ${teamId}!`,
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
}

export async function inviteMember(
  teamId: string,
  email: string
): Promise<Result<void>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    const data = await team.createMembership(
      teamId,
      [],
      email,
      undefined,
      undefined,
      `http://${HOSTNAME}/accept/${teamId}`,
      email.split("@")[0]
    );

    await createUserData(data.userId, email.split("@")[0]);

    revalidateTag(`team:${teamId}`);

    return {
      success: true,
      message: `Invitation sent to ${email}.`,
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
}

/**
 *  Remove a member from the team
 * @param userId The user ID to remove
 * @returns {Promise<Result<void>>}
 */
export async function removeMember(
  teamId: string,
  userId: string
): Promise<Result<void>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    const userMembership = await team.listMemberships(teamId, [
      Query.equal("userId", user.$id),
    ]);
    const currentUserRole = userMembership.memberships[0]?.roles[0];

    const memberToRemove = await team.listMemberships(teamId, [
      Query.equal("userId", userId),
    ]);
    const membership = memberToRemove.memberships[0];

    if (!membership) {
      throw new Error("User is not a member of this team.");
    }

    const memberRole = membership.roles[0];

    if (membership.roles.includes(OWNER_ROLE)) {
      throw new Error("You cannot remove the owner of the team.");
    }

    if (memberRole === ADMIN_ROLE && currentUserRole !== OWNER_ROLE) {
      throw new Error("Only team owners can remove admin members.");
    }

    if (currentUserRole !== OWNER_ROLE && currentUserRole !== ADMIN_ROLE) {
      throw new Error("You must be an admin or owner to remove team members.");
    }

    await team.deleteMembership(teamId, membership.$id);
    revalidateTag(`team:${teamId}`);

    return {
      success: true,
      message: `${membership.userName} has been removed from the team.`,
    };
  } catch (err) {
    const error = err as Error;
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Promote a team member to admin
 * @param {string} teamId The team ID
 * @param {string} userId The membership ID to promote
 * @returns {Promise<Result<void>>}
 */
export async function promoteToAdmin(
  teamId: string,
  userId: string
): Promise<Result<void>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    await checkUserRole(teamId, user.$id, [OWNER_ROLE]);

    const userMembership = await team.listMemberships(teamId, [
      Query.equal("userId", userId),
    ]);
    const membership = userMembership.memberships[0];
    await team.updateMembership(teamId, membership.$id, [ADMIN_ROLE]);

    revalidateTag(`team:${teamId}`);

    return {
      success: true,
      message: "Member has been promoted to admin.",
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
}

/**
 * Remove admin role from a team member
 * @param {string} teamId The team ID
 * @param {string} userId The membership ID to demote
 * @returns {Promise<Result<void>>}
 */
export async function removeAdminRole(
  teamId: string,
  userId: string
): Promise<Result<void>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    await checkUserRole(teamId, user.$id, [OWNER_ROLE]);

    const userMembership = await team.listMemberships(teamId, [
      Query.equal("userId", userId),
    ]);
    const membership = userMembership.memberships[0];
    await team.updateMembership(teamId, membership.$id, []);

    revalidateTag(`team:${teamId}`);

    return {
      success: true,
      message: "Admin role has been removed.",
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
}

export async function getCurrentUserRoles(
  teamId: string
): Promise<Result<string[]>> {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    const userMembership = await team.listMemberships(teamId, [
      Query.equal("userId", user.$id),
    ]);

    return {
      success: true,
      message: "User roles successfully retrieved.",
      data: userMembership.memberships[0]?.roles || [],
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
}

/**
 * Check if user has required role for team action
 * @param team The team client
 * @param teamId The team ID
 * @param userId The user ID
 * @param requiredRoles Array of allowed roles
 * @returns Role if authorized, throws error if not
 */
export async function checkUserRole(
  teamId: string,
  userId: string,
  requiredRoles: string[]
): Promise<Models.MembershipList> {
  const { team } = await createSessionClient();

  const userMembership = await team.listMemberships(teamId, [
    Query.equal("userId", userId),
  ]);

  const currentUserRoles = userMembership.memberships[0]?.roles;

  if (
    !currentUserRoles ||
    !currentUserRoles.some((role) => requiredRoles.includes(role))
  ) {
    throw new Error(
      `You must be ${requiredRoles.join(" or ")} to perform this action.`
    );
  }

  return userMembership;
}
