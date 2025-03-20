import { LucideEllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProfile } from "@/components/user/edit-profile";
import { UserData } from "@/interfaces/user.interface";

interface UserActionsProps {
  user: UserData;
}

export function UserActions({ user }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="size-8">
          <LucideEllipsisVertical className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditProfile user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
