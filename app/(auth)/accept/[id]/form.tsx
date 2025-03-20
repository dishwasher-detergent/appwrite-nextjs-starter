"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/userSession";
import { createClient } from "@/lib/client/appwrite";
import { LucideLoader2 } from "lucide-react";
import { toast } from "sonner";

interface AcceptFormProps {
  teamId: string;
  membershipId: string;
  userId: string;
  secret: string;
}

export function AcceptForm({
  teamId,
  membershipId,
  userId,
  secret,
}: AcceptFormProps) {
  const router = useRouter();
  const { user, refreshSession } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  async function acceptTeamInvite() {
    setLoading(true);

    try {
      const { team, account } = await createClient();
      await team.updateMembershipStatus(teamId, membershipId, userId, secret);
      await refreshSession();

      if (user?.passwordUpdate == "") {
        router.push("/recover");
      } else {
        await account.deleteSessions();
        router.push(`/signin`);
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to accept invite");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        acceptTeamInvite();
      }}
    >
      <input name="teamId" value={teamId} readOnly className="hidden" />
      <input
        name="membershipId"
        value={membershipId}
        readOnly
        className="hidden"
      />
      <input name="userId" value={userId} readOnly className="hidden" />
      <input name="secret" value={secret} readOnly className="hidden" />
      <Button className="w-full" type="submit" disabled={loading}>
        Accept Invite
        {loading && <LucideLoader2 className="mr-2 size-3.5 animate-spin" />}
      </Button>
    </form>
  );
}
