"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logOut } from "@/lib/auth";
import { getInitials } from "@/lib/utils";

import { LucideLogOut, LucideUser } from "lucide-react";
import Link from "next/link";
import { Models } from "node-appwrite";
import { useMemo } from "react";

export function UserInformation({
  user,
}: {
  user: Models.User<Models.Preferences>;
}) {
  const initals = useMemo(() => {
    return getInitials(user.name);
  }, [user.name]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-row items-center gap-2 rounded-full pr-1 pl-3"
        >
          <p className="text-sm">Hello, {user.name}</p>
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-sm text-primary-foreground">
              {initals}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/app/profile">
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
