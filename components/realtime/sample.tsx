"use client";

import { LucideLoader2 } from "lucide-react";
import Image from "next/image";

import { DeleteSample } from "@/components/sample/delete-sample";
import { EditSample } from "@/components/sample/edit-sample";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSample } from "@/hooks/useSample";
import { Sample as SampleType } from "@/interfaces/sample.interface";
import {
  AVATAR_BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
  SAMPLE_BUCKET_ID,
} from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export function Sample({ initialSample }: { initialSample: SampleType }) {
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
          <div
            className="flex items-center gap-2"
            role="toolbar"
            aria-label="Sample actions"
          >
            <EditSample sample={sample} />
            <DeleteSample sample={sample} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={
                sample?.user?.avatar
                  ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${sample.user.avatar}/view?project=${PROJECT_ID}`
                  : undefined
              }
              alt={sample?.user?.name || "User"}
            />
            <AvatarFallback>{getInitials(sample?.user?.name)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-foreground">
            {sample?.user?.name || "Unknown"}
          </p>
        </div>
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
