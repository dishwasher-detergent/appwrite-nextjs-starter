"use client";

import { LucideLoader2, LucideShieldUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { promoteToAdmin } from "@/lib/team";

interface PromoteMemberAdminProps {
  userId: string;
  teamId: string;
}

export function PromoteMemberAdmin({
  userId,
  teamId,
}: PromoteMemberAdminProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handlePromote() {
    setLoading(true);

    const data = await promoteToAdmin(teamId, userId);

    if (data.success) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }

    setLoading(false);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          Promote to Admin
          <DropdownMenuShortcut>
            {loading ? (
              <LucideLoader2 className="size-3.5 animate-spin" />
            ) : (
              <LucideShieldUser className="size-3.5" />
            )}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Promote Member To Admin?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(!open)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handlePromote}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
