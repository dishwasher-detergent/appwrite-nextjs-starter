"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sample } from "@/interfaces/sample.interface";
import { EditSample } from "@/components/edit-sample";
import { DeleteSample } from "@/components/delete-sample";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";

import Image from "next/image";

export function SampleCard(sample: Sample) {
  return (
    <Card className="break-inside-avoid-column rounded-md">
      <CardContent className="space-y-2">
        {sample.image && (
          <Image
            src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${sample.image}/view?project=${PROJECT_ID}`}
            alt={sample.name}
            className="rounded-md object-cover bg-primary aspect-square"
            width={500}
            height={500}
            sizes="(max-width: 500px)"
          />
        )}
      </CardContent>
      <CardHeader>
        <CardTitle className="truncate">{sample.name}</CardTitle>
        <CardDescription className="truncate">
          {sample.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row justify-end gap-1">
        <DeleteSample sample={sample} />
        <EditSample sample={sample} />
      </CardFooter>
    </Card>
  );
}
