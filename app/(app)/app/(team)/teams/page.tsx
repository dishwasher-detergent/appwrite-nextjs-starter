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
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.map((team) => <TeamCard key={team.$id} {...team} />)}
            </section>
        </>
    )
}
