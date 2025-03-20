import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { TeamAdmins } from "@/components/team/team-admins";
import { TeamContent } from "@/components/team/team-content";
import { TeamDescription } from "@/components/team/team-description";
import { TeamHeader } from "@/components/team/team-header";
import { TeamMembers } from "@/components/team/team-members";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { listSamples } from "@/lib/db";
import { getCurrentUserRoles, getTeamById } from "@/lib/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const { data, success } = await getTeamById(teamId);
  const { data: roles } = await getCurrentUserRoles(teamId);
  const { data: sampleData } = await listSamples([
    Query.orderDesc("$createdAt"),
    Query.equal("teamId", teamId),
  ]);

  const isOwner = roles!.includes(OWNER_ROLE);
  const isAdmin = roles!.includes(ADMIN_ROLE);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <article className="space-y-6">
      <TeamHeader team={data} isAdmin={isAdmin} />
      <main className="px-4 space-y-6">
        <TeamDescription team={data} />
        <TeamAdmins members={data.members ?? []} />
        <TeamMembers
          members={data.members ?? []}
          teamId={data.$id}
          isOwner={isOwner}
        />
        <TeamContent samples={sampleData?.documents ?? []} teamId={teamId} />
      </main>
    </article>
  );
}
