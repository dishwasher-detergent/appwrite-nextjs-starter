"use client";

import { LucideLink } from "lucide-react";
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
import { TeamData } from "@/interfaces/team.interface";
import {
  AVATAR_BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
} from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export function TeamCard(team: TeamData) {
  return (
    <Card className="rounded-lg overflow-hidden py-0">
      <CardContent className="p-0 relative flex flex-row gap-1">
        <Avatar className="h-6 w-6">
            <AvatarImage
                src={
                    team.avatar
                    ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${team.avatar}/view?project=${PROJECT_ID}`
                    : undefined
                }
                alt={team.name || "Unknown"}
            />
            <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
        </Avatar>
        <CardHeader className="flex flex-col justify-end bottom-0 absolute w-full p-4 h-full bg-linear-to-t from-primary to-primary/20">
          <CardTitle className="text-primary-foreground">
            <Button
              className="truncate p-0! text-primary-foreground text-xl"
              variant="link"
              asChild
            >
              <Link href={`/app/teams/${team.$id}`}>
                {team.name}
                <LucideLink />
              </Link>
            </Button>
          </CardTitle>
          <CardDescription className="text-primary-foreground line-clamp-3">
            {team?.about ?? "No about provided."}
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
