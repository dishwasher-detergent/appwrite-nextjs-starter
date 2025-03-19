import { AddSample } from "@/components/create-sample";
import { CreateTeam } from "@/components/create-team";
import { Samples } from "@/components/realtime/samples";
import { getSamples } from "@/lib/db";
import { listTeams } from "@/lib/team";
import { Query } from "node-appwrite";

export default async function AppPage() {
  const { data } = await getSamples([Query.orderDesc("$createdAt")]);
  const { data: teams } = await listTeams();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Samples</h2>
        {teams && teams?.length > 0 ? (
          <AddSample teams={teams} />
        ) : (
          <CreateTeam />
        )}
      </header>
      <Samples initialSamples={data?.documents} />
    </>
  );
}
