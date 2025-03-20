import { redirect } from "next/navigation";

import { TeamAdmins } from "@/components/team/team-admins";
import { TeamDescription } from "@/components/team/team-description";
import { TeamHeader } from "@/components/team/team-header";
import { TeamMembers } from "@/components/team/team-members";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { getCurrentUserRoles, getTeamById } from "@/lib/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const { data, success } = await getTeamById(teamId);
  const { data: roles } = await getCurrentUserRoles(teamId);

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
      </main>
    </article>
  );
}
