import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { getTeamById } from "@/lib/team";
import { AcceptForm } from "./form";

export default async function Invite({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    teamId: string;
    membershipId: string;
    userId: string;
    secret: string;
  }>;
}) {
  const { id } = await params;
  const { teamId, membershipId, userId, secret } = await searchParams;

  const { data } = await getTeamById(id);

  if (!data) {
    redirect("/app");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        {data?.avatar && (
          <AspectRatio ratio={1} className="w-full overflow-hidden rounded-lg">
            <Image
              src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${data.avatar}/view?project=${PROJECT_ID}`}
              alt={data?.name}
              className="object-cover object-left-top bg-primary"
              fill
            />
          </AspectRatio>
        )}
        <CardTitle className="text-2xl mt-2">Join {data?.name}</CardTitle>
        <CardDescription>
          Accept Invite to join the team {data?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AcceptForm
          teamId={teamId}
          membershipId={membershipId}
          userId={userId}
          secret={secret}
        />
      </CardContent>
    </Card>
  );
}
