"use client";

import { LucideLoader2 } from "lucide-react";
import Image from "next/image";

import { DeleteSample } from "@/components/sample/delete-sample";
import { EditSample } from "@/components/sample/edit-sample";
import { useSample } from "@/hooks/useSample";
import { Sample as SampleType } from "@/interfaces/sample.interface";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { ProfileLink } from "../profile-link";

interface SampleProps {
  initialSample: SampleType;
  canEdit: boolean;
}

export function Sample({ initialSample, canEdit }: SampleProps) {
  const { sample, loading } = useSample({ initialSample });

  if (loading)
    return (
      <div className="w-full h-full grid place-items-center">
        <LucideLoader2 className="size-8 animate-spin" />
      </div>
    );

  return (
    <article className="container mx-auto">
      <header className="mb-8">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-bold tracking-tight">{sample.name}</h1>
          {canEdit && (
            <div
              className="flex items-center gap-2"
              role="toolbar"
              aria-label="Sample actions"
            >
              <EditSample sample={sample} />
              <DeleteSample sample={sample} />
            </div>
          )}
        </div>
        <ProfileLink
          className="text-foreground"
          avatar={sample?.user?.avatar}
          name={sample?.user?.name}
          href={`/app/users/${sample.userId}`}
        />
      </header>
      <div className="grid gap-8 md:grid-cols-[256px,1fr]">
        <figure className="relative">
          {sample?.image ? (
            <Image
              src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${sample.image}/view?project=${PROJECT_ID}`}
              alt={`Sample image for ${sample.name}`}
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
            Sample image for {sample.name}
          </figcaption>
        </figure>
        <main>
          <section aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-lg font-semibold mb-2">
              Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {sample?.description ?? "No description provided."}
            </p>
          </section>
        </main>
      </div>
    </article>
  );
}
