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
      <CardContent className="p-1 relative flex flex-row gap-1">
        <Avatar className="size-18 rounded-lg">
            <AvatarImage
                src={
                    team.avatar
                    ? `${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${team.avatar}/view?project=${PROJECT_ID}`
                    : undefined
                }
                alt={team.name || "Unknown"}
            />
            <AvatarFallback className="rounded-lg">{getInitials(team.name)}</AvatarFallback>
        </Avatar>
        <CardHeader className="flex flex-col gap-0 w-full h-full px-2">
          <CardTitle>
            <Button
              className="truncate p-0! text-lg h-auto"
              variant="link"
              asChild
            >
              <Link href={`/app/teams/${team.$id}`}>
                {team.name}
                <LucideLink />
              </Link>
            </Button>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {team?.about ?? "No about provided."}
          </CardDescription>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
