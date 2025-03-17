import { redirect } from "next/navigation";

import { getTeamById } from "@/lib/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamId } = await params;
  const { data, success } = await getTeamById(teamId);

  if (!success || !data) {
    redirect("/app");
  }

  return <p>{data.name}</p>;
}
