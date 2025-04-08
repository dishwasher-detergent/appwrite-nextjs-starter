import { CreateTeam } from "@/components/team/create-team";
import { TeamCard } from "@/components/team/team-card";
import { listTeams } from "@/lib/team";

export default async function TeamsPage() {
  const { data } = await listTeams();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Your Teams</h2>
        <CreateTeam />
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.map((team) => (
          <TeamCard key={team.$id} {...team} />
        ))}
        {data?.length === 0 && (
          <p className="font-semibold text-muted-foreground">No teams found</p>
        )}
      </section>
    </>
  );
}
