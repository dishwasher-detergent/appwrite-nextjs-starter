import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl mt-2">Accept Team Invite</CardTitle>
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
