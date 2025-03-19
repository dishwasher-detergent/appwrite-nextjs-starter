"use client";

import { LucideLogOut, LucideUser, LucideUsers } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/interfaces/user.interface";
import { logOut } from "@/lib/auth";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { getInitials } from "@/lib/utils";

export function UserInformation({ user }: { user: User }) {
  const initals = useMemo(() => {
    return getInitials(user.name);
  }, [user.name]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-row items-center gap-2 rounded-lg pr-1 pl-3"
        >
          <p className="text-sm">Hello, {user.name}</p>
          <Avatar className="size-7 rounded-lg">
            <AvatarImage
              src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${user.avatar}/view?project=${PROJECT_ID}`}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary text-sm text-primary-foreground">
              {initals}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/app/teams">
            Teams
            <DropdownMenuShortcut>
              <LucideUsers className="size-3" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/app/users/${user.$id}`}>
            Profile
            <DropdownMenuShortcut>
              <LucideUser className="size-3" />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logOut}>
          Logout
          <DropdownMenuShortcut>
            <LucideLogOut className="size-3" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
