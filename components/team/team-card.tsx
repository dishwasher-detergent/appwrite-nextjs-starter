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
import { TeamData } from "@/interfaces/team.interface";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { AspectRatio } from "../ui/aspect-ratio";

export function TeamCard(team: TeamData) {
  return (
    <Card className="break-inside-avoid-column rounded-lg overflow-hidden py-0 gap-0 ">
      <CardContent className="p-0 relative">
        <AspectRatio ratio={1} className="w-full">
          {team.avatar ? (
            <Image
              src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${team.avatar}/view?project=${PROJECT_ID}`}
              alt={team.name}
              className="object-cover object-left-top bg-primary"
              fill
            />
          ) : (
            <div className="w-full aspect-square bg-muted grid place-items-center">
              <p className="text-muted-foreground font-semibold">No image</p>
            </div>
          )}
        </AspectRatio>
        <CardHeader className="flex flex-col justify-end bottom-0 absolute w-full p-4 h-full bg-linear-to-t from-primary to-primary/20">
          <CardTitle className="text-primary-foreground">
            <Button
              className="truncate p-0! text-primary-foreground text-xl"
              variant="link"
              asChild
            >
              <Link href={`/app/teams/${team.$id}`}>{team.name}</Link>
            </Button>
          </CardTitle>
          <CardDescription className="text-primary-foreground line-clamp-3">
            {team?.description ?? "No description provided."}
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
