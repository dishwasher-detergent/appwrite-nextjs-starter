import { redirect } from "next/navigation";
import Image from "next/image";

import { getTeamById } from "@/lib/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamId } = await params;
  const { data, success, message } = await getTeamById(teamId);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <article className="container mx-auto">
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
          <div
            className="flex items-center gap-2"
            role="toolbar"
            aria-label="Team actions"
          >
            <p>Edit Team</p>
            <p>Delete Team</p>
          </div>
        </div>
      </header>
      <div className="grid gap-8 md:grid-cols-[256px,1fr]">
        <figure className="relative">
          {data?.avatar ? (
            <Image
              src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${data.avatar}/view?project=${PROJECT_ID}`}
              alt={`Team avatar for ${data.name}`}
              className="rounded-lg border bg-muted object-cover"
              width={256}
              height={256}
              priority
            />
          ) : (
            <div
              role="img"
              aria-label="No image available"
              className="bg-muted grid place-items-center size-64 rounded-lg"
            >
              <p className="text-muted-foreground font-medium">No image</p>
            </div>
          )}
          <figcaption className="sr-only">
            Team image for {data.name}
          </figcaption>
        </figure>
        <main>
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-lg font-semibold mb-2">
              About
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {data?.about ?? "No about provided."}
            </p>
          </section>
        </main>
      </div>
    </article>
  );
}
