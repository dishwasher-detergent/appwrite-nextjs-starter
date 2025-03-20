import { LucideEllipsisVertical } from "lucide-react";

import { DeleteTeam } from "@/components/team/delete-team";
import { EditTeam } from "@/components/team/edit-team";
import { InviteTeam } from "@/components/team/invite-team";
import { LeaveTeam } from "@/components/team/leave-team";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamData } from "@/interfaces/team.interface";

interface TeamActionsProps {
  team: TeamData;
  isAdmin: boolean;
}

export function TeamActions({ team, isAdmin }: TeamActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="size-8">
          <LucideEllipsisVertical className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <InviteTeam team={team} />
        <LeaveTeam team={team} />
        {isAdmin && (
          <>
            <EditTeam team={team} />
            <DeleteTeam team={team} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
