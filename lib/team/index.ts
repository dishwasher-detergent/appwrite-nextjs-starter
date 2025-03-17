"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { ID, Models, Permission, Query, Role, Teams } from "node-appwrite";

import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { Result } from "@/interfaces/result.interface";
import { TeamData } from "@/interfaces/team.interface";
import { getCachedLoggedInUser } from "@/lib/auth";
import { DATABASE_ID, TEAM_COLLECTION_ID } from "@/lib/constants";
import { createSessionClient } from "@/lib/server/appwrite";
import { AddTeamFormData } from "./schema";

/**
 * Get a team by ID
 * @param {string} id The team ID
 * @returns {Promise<Result<TeamData>} The team
 */
export async function getTeamById(id: string): Promise<Result<TeamData>> {
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  return unstable_cache(
    async () => {
      try {
        const data = await database.getDocument<TeamData>(
          DATABASE_ID,
          TEAM_COLLECTION_ID,
          id
        );

        const memberships = await team.listMemberships(data.teamId);

        return {
          success: true,
          message: "Team successfully retrieved.",
          data: {
            ...data,
            members: memberships.memberships,
          },
        };
      } catch (err) {
        const error = err as Error;

        // This is where you would look to something like Splunk, or LogRocket.
        console.error(error);
        
        return {
          success: false,
          message: error.message,
        };
      }
    },
    ["team", id],
    {
      tags: ["team", `team-${id}`],
      revalidate: 600,
    }
  )();
}

/**
 * List all teams
 * @returns {Promise<Result<TeamData[]>} The teams
 */
export async function listTeams(): Promise<Result<TeamData[]>> {
  const user = await getCachedLoggedInUser();

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


        
        return {
          success: false,
          message: error.message,
        };
      }
    },
    ["teams"],
    {
      tags: ["teams"],
      revalidate: 600,
    }
  )();
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
  const user = await getCachedLoggedInUser();

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
    const teamResponse = await team.create(id, data.name, [
      ADMIN_ROLE,
      OWNER_ROLE
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
        avatar: data.image,
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

    // This is where you would look to something like Splunk, or LogRocket.
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
 * @param {AddTeamFormData} params.data The team data
 * @param {string[]} [params.permissions] The permissions for the team (optional)
 * @returns {Promise<Result<TeamData>>} The updated team
 */
export async function updateTeam({
  id,
  data,
  permissions = undefined,
}: {
  id: string;
  data: AddTeamFormData;
  permissions?: string[];
}): Promise<Result<TeamData>> {
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  try {
    await team.updateName(id, data.name);

    const teamData = await database.updateDocument<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      id,
      data,
      permissions
    );

    revalidateTag("teams");
    revalidateTag(`team-${id}`);

    return {
      success: true,
      message: "Team successfully updated.",
      data: teamData,
    };
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk, or LogRocket.
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
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { database, team } = await createSessionClient();

  try {
    await team.delete(id);
    await database.deleteDocument(DATABASE_ID, TEAM_COLLECTION_ID, id);

    revalidateTag("teams");

    return {
      success: true,
      message: "Team successfully deleted.",
    };
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk, or LogRocket.
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
  const user = await getCachedLoggedInUser();

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
      throw new Error(
        "You cannot leave a team you own. Please transfer ownership first."
      );
    }

    await team.deleteMembership(teamId, membership.$id);

    const data = await database.listDocuments<TeamData>(
      DATABASE_ID,
      TEAM_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(1)]
    );

    revalidateTag("teams");
    revalidateTag(`team-${teamId}`);

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

    // This is where you would look to something like Splunk, or LogRocket.
    console.error(error);
    
    return {
      success: false,
      message: error.message,
    };
  }
}

// Add Member

/**
 *  Remove a member from the team
 * @param userId The user ID to remove
 * @returns {Promise<Result<void>>}
 */
export async function removeMember(
  teamId: string,
  userId: string
): Promise<Result<void>> {
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    await checkUserRole(team, teamId, user.$id, [OWNER_ROLE, ADMIN_ROLE]);

    const memberToRemove = await team.listMemberships(teamId, [
      Query.equal("userId", userId),
    ]);

    const membership = memberToRemove.memberships[0];

    if (!membership) {
      throw new Error("User is not a member of this team.");
    }

    if (membership.roles.includes(OWNER_ROLE)) {
      throw new Error("You cannot remove the owner of the team.");
    }

    await team.deleteMembership(teamId, membership.$id);

    revalidateTag(`team-${teamId}`);

    return {
      success: true,
      message: `${userId} has been removed from the team.`,
    };
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk, or LogRocket.
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
 * @param {string} membershipId The membership ID to promote
 * @returns {Promise<Result<void>>}
 */
export async function promoteToAdmin(
  teamId: string,
  membershipId: string
): Promise<Result<void>> {
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    await checkUserRole(team, teamId, user.$id, [OWNER_ROLE, ADMIN_ROLE]);
    await team.updateMembership(teamId, membershipId, [ADMIN_ROLE]);

    revalidateTag(`team-${teamId}`);

    return {
      success: true,
      message: "Member has been promoted to admin.",
    };
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk, or LogRocket.
    console.error(error);
    
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * Promote a team member to owner
 * @param {string} teamId The team ID
 * @param {string} userId The membership ID to promote
 * @returns {Promise<Result<void>>}
 */
export async function promoteToOwner(
  teamId: string,
  userId: string
): Promise<Result<void>> {
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    const userMembership = await checkUserRole(team, teamId, user.$id, [
      OWNER_ROLE,
    ]);

    await team.updateMembership(teamId, userMembership.memberships[0].$id, [
      ADMIN_ROLE,
    ]);
    await team.updateMembership(teamId, userId, [OWNER_ROLE]);

    revalidateTag(`team-${teamId}`);

    return {
      success: true,
      message: "Ownership has been transferred successfully.",
    };
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk, or LogRocket.
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
 * @param {string} membershipId The membership ID to demote
 * @returns {Promise<Result<void>>}
 */
export async function removeAdminRole(
  teamId: string,
  membershipId: string
): Promise<Result<void>> {
  const user = await getCachedLoggedInUser();

  if (!user) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  const { team } = await createSessionClient();

  try {
    await checkUserRole(team, teamId, user.$id, [OWNER_ROLE, ADMIN_ROLE]);
    await team.updateMembership(teamId, membershipId, []);

    revalidateTag(`team-${teamId}`);

    return {
      success: true,
      message: "Admin role has been removed.",
    };
  } catch (err) {
    const error = err as Error;

    // This is where you would look to something like Splunk, or LogRocket.
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
async function checkUserRole(
  team: Teams,
  teamId: string,
  userId: string,
  requiredRoles: string[]
): Promise<Models.MembershipList> {
  const userMembership = await team.listMemberships(teamId, [
    Query.equal("userId", userId),
  ]);

  const currentUserRole = userMembership.memberships[0]?.roles[0];

  if (!currentUserRole || !requiredRoles.includes(currentUserRole)) {
    throw new Error(
      `You must be ${requiredRoles.join(" or ")} to perform this action.`
    );
  }

  return userMembership;
}
