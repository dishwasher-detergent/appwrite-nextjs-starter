import { Query } from "node-appwrite";

import { Samples } from "@/components/realtime/samples";
import { AddSample } from "@/components/sample/create-sample";
import { listSamples } from "@/lib/db";
import { getTeamById } from "@/lib/team";

export default async function SamplesPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const teams = [];
  const { data } = await listSamples([
    Query.orderDesc("$createdAt"),
    Query.equal("teamId", teamId),
  ]);
  const { data: teamData } = await getTeamById(teamId);
  if (teamData) {
    teams.push(teamData);
  }

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Samples</h2>
        <AddSample teams={teams} />
      </header>
      <Samples initialSamples={data?.documents} teamId={teamId} />
    </>
  );
}
