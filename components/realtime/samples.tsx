"use client";

import { LucideLoader2 } from "lucide-react";

import { SampleCard } from "@/components/sample-card";
import { useSamples } from "@/hooks/useSamples";
import { Sample } from "@/interfaces/sample.interface";

interface SamplesProps {
  initialSamples?: Sample[];
  teamId?: string;
  userId?: string;
}

export function Samples({ initialSamples, teamId, userId }: SamplesProps) {
  const { loading, samples } = useSamples({ initialSamples, teamId, userId });

  if (loading)
    return (
      <div className="w-full h-full grid place-items-center">
        <LucideLoader2 className="size-8 animate-spin" />
      </div>
    );

  return (
    <section className="min-h-full columns-xs items-start gap-4 space-y-4 w-full">
      {samples?.map((sample) => (
        <SampleCard key={sample.$id} {...sample} />
      ))}
      {samples?.length === 0 && (
        <p className="font-semibold text-muted-foreground">No samples found</p>
      )}
    </section>
  );
}
