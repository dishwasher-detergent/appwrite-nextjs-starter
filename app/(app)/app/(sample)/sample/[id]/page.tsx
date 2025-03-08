import { DeleteSample } from "@/components/delete-sample";
import { EditSample } from "@/components/edit-sample";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { getSampleById } from "@/lib/db";

import Image from "next/image";

import { redirect } from "next/navigation";

export default async function SamplePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sampleId } = await params;
  const { data, success } = await getSampleById(sampleId);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <article className="space-y-6">
      <header className="relative">
        <div
          role="img"
          aria-label="Profile banner"
          className="w-full bg-primary rounded-xl h-32"
        />
        <div className="flex items-start justify-between px-4 -mt-16">
          <figure className="relative flex-shrink-0">
            {data?.image ? (
              <Image
                src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${data.image}/view?project=${PROJECT_ID}`}
                alt={`${data.name}'s image`}
                className="rounded-full border-4 border-background object-cover bg-primary aspect-square"
                width={128}
                height={128}
                priority
              />
            ) : (
              <div
                aria-label="Default profile picture"
                className="rounded-full border-4 border-background bg-muted aspect-square w-32 h-32"
              />
            )}
          </figure>
          <div className="pt-18 flex flex-row gap-2">
            <EditSample sample={data} />
            <DeleteSample sample={data} />
          </div>
        </div>
      </header>
      <main className="px-4 space-y-6">
        <div className="max-w-prose">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {data.name}
          </h1>
          {data.about && (
            <section aria-label="Description">
              <p className="text-muted-foreground leading-relaxed">
                {data.description}
              </p>
            </section>
          )}
        </div>
      </main>
    </article>
  );
}
