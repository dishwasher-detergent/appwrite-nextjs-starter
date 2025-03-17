import { redirect } from "next/navigation";
import Image from "next/image";

import { getTeamById } from "@/lib/team";
import { ENDPOINT, AVATAR_BUCKET_ID, PROJECT_ID } from "@/lib/constants";
import { EditTeam } from "@/components/edit-team";
import { DeleteTeam } from "@/components/delete-team";

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

  return (
    <article className="space-y-6">
      <header className="relative">
        <div
          role="img"
          aria-label="Team banner"
          className="w-full bg-linear-to-r from-primary to-secondary rounded-xl h-32"
        />
        <div className="flex items-start justify-between px-4 -mt-16">
          <figure className="relative flex-shrink-0">
            {data?.avatar ? (
              <Image
                src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${data.avatar}/view?project=${PROJECT_ID}`}
                alt={`${data.name}'s picture`}
                className="rounded-full border-4 border-background object-cover bg-primary aspect-square"
                width={128}
                height={128}
                priority
              />
            ) : (
              <div
                aria-label="Default picture"
                className="rounded-full border-4 border-background bg-muted aspect-square w-32 h-32"
              />
            )}
          </figure>
          <div className="pt-18 flex flex-row gap-1">
            <EditTeam team={data} />
            <DeleteTeam team={data} />
          </div>
        </div>
      </header>
      <main className="px-4 space-y-6">
        <div className="max-w-prose">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {data.name}
          </h1>
          <section aria-label="About">
            <p className="text-muted-foreground leading-relaxed">
              {data.about ?? "Add a description to your team."}
            </p>
          </section>
        </div>
      </main>
    </article>
  );
}
