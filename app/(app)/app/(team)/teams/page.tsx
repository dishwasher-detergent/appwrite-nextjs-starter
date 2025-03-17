import Link from "next/link";

import { listTeams } from "@/lib/team";
import { CreateTeam } from "@/components/create-team";

export async function TeamsPage() {
    const { data } = await listTeams();

    return (
        <>
            <header className="flex flex-row justify-between items-center pb-4 w-full">
                <h2 className="font-bold">Teams</h2>
                <CreateTeam />
            </header>
            <section>
                {data.map((team) => <Link href={`/app/teams/${team.$id}`} key={team.$id}>{team.name}</Link>)}
            </section>
        </>
    )
}
