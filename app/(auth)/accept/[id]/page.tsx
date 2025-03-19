"use client";

import { LucideLoader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/hooks/userSession";
import { createClient } from "@/lib/client/appwrite";
import { toast } from "sonner";

export default function Invite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refreshSession } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const teamId = searchParams.get("teamId") as string;
  const membershipId = searchParams.get("membershipId") as string;
  const userId = searchParams.get("userId") as string;
  const secret = searchParams.get("secret") as string;

  async function acceptTeamInvite() {
    setLoading(true);

    try {
      const { team, account } = await createClient();
      await team.updateMembershipStatus(teamId, membershipId, userId, secret);
      await refreshSession();

      if (user?.passwordUpdate == "") {
        router.push("/password");
      } else {
        await account.deleteSessions();
        router.push(`/login`);
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to accept invite");
    }

    setLoading(false);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Accept Invite</CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          acceptTeamInvite();
        }}
      >
        <CardContent className="grid gap-4">
          <input name="teamId" value={teamId} readOnly className="hidden" />
          <input
            name="membershipId"
            value={membershipId}
            readOnly
            className="hidden"
          />
          <input name="userId" value={userId} readOnly className="hidden" />
          <input name="secret" value={secret} readOnly className="hidden" />
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            Accept Invite
            {loading && (
              <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
