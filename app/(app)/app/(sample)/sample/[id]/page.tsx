import Image from "next/image";
import { redirect } from "next/navigation";

import { DeleteSample } from "@/components/delete-sample";
import { EditSample } from "@/components/edit-sample";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { getSampleById } from "@/lib/db";

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
    <article className="container mx-auto">
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
          <div
            className="flex items-center gap-2"
            role="toolbar"
            aria-label="Sample actions"
          >
            <EditSample sample={data} />
            <DeleteSample sample={data} />
          </div>
        </div>
      </header>
      <div className="grid gap-8 md:grid-cols-[256px,1fr]">
        <figure className="relative">
          {data?.image ? (
            <Image
              src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${data.image}/view?project=${PROJECT_ID}`}
              alt={`Sample image for ${data.name}`}
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
            Sample image for {data.name}
          </figcaption>
        </figure>

        <main>
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-lg font-semibold mb-2">
              Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {data?.description ?? "No description provided."}
            </p>
          </section>
        </main>
      </div>
    </article>
  );
}
