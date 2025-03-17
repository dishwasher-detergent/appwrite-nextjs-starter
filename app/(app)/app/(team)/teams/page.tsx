import { listTeams } from "@/lib/team";
import { CreateTeam } from "@/components/create-team";
import { TeamCard } from "@/components/team-card";

export default async function TeamsPage() {
    const { data } = await listTeams();

    return (
        <>
            <header className="flex flex-row justify-between items-center pb-4 w-full">
                <h2 className="font-bold">Your Teams</h2>
                <CreateTeam />
            </header>
            <section>
                {data?.map((team) => <TeamCard key={team.$id} team={team} />)}
            </section>
        </>
    )
}
