"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sample } from "@/interfaces/sample.interface";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { LucideLink } from "lucide-react";

export function SampleCard(sample: Sample) {
  return (
    <Card className="break-inside-avoid-column rounded-md overflow-hidden py-0 gap-0 ">
      <CardContent className="p-0 relative">
        {sample.image ? (
          <Image
            src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${sample.image}/view?project=${PROJECT_ID}`}
            alt={sample.name}
            className="object-cover bg-primary"
            width={500}
            height={500}
            sizes="(max-width: 500px)"
          />
        ) : (
          <div className="w-full aspect-video bg-muted">
            <p className="flex h-full items-center justify-center text-muted-foreground font-semibold">
              No image
            </p>
          </div>
        )}
        <CardHeader className="flex flex-col justify-end bottom-0 absolute w-full p-4 h-full bg-linear-to-t from-primary to-transparent">
          <CardTitle className="text-primary-foreground">
            <Button
              className="truncate p-0! text-primary-foreground text-xl"
              variant="link"
              asChild
            >
              <Link href={`/app/sample/${sample.$id}`}>
                {sample.name}
                <LucideLink />
              </Link>
            </Button>
          </CardTitle>
          <CardDescription className="text-primary-foreground line-clamp-3">
            {sample?.description ?? "No description provided."}
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
