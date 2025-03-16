"use client";

import { LucideLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sample } from "@/interfaces/sample.interface";
import {
  AVATAR_BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
  SAMPLE_BUCKET_ID,
} from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export function SampleCard(sample: Sample) {
  return (
    <Card className="break-inside-avoid-column rounded-lg overflow-hidden py-0 gap-0 ">
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
          <div className="w-full aspect-square bg-muted grid place-items-center">
            <p className="text-muted-foreground font-semibold">No image</p>
          </div>
        )}
        <CardHeader className="flex flex-col justify-end bottom-0 absolute w-full p-4 h-full bg-linear-to-t from-primary to-primary/20">
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
            <p className="text-sm text-primary-foreground">
              {sample?.user?.name || "Unknown"}
            </p>
          </div>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
