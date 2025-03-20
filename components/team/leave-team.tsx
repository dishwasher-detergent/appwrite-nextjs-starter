"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideDoorOpen, LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { DyanmicDrawer } from "@/components/ui/dynamic-drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TeamData } from "@/interfaces/team.interface";
import { leaveTeam } from "@/lib/team";
import { LeaveTeamFormData, leaveTeamSchema } from "@/lib/team/schemas";
import { cn } from "@/lib/utils";

export function LeaveTeam({ team }: { team: TeamData }) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title={`Leave ${team.name}`}
      description="This is permanent and cannot be undone."
      open={open}
      setOpen={setOpen}
      button={
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          Leave
          <DropdownMenuShortcut>
            <LucideDoorOpen className="size-3.5" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      }
    >
      <LeaveForm setOpen={setOpen} team={team} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
  team: TeamData;
}

function LeaveForm({ className, setOpen, team }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<LeaveTeamFormData>({
    resolver: zodResolver(leaveTeamSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: LeaveTeamFormData) {
    setLoading(true);

    if (values.name !== team.name) {
      form.setError("name", {
        message: "Team name does not match.",
      });

      toast.error("Team name does not match.");
      setLoading(false);
      return;
    }

    const data = await leaveTeam(team.$id);

    if (data.success) {
      toast.success(data.message);
      router.refresh();
      setOpen(false);
    } else {
      toast.error(data.message);
    }

    setLoading(false);
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "h-full flex flex-col gap-4 overflow-hidden p-4 md:p-0",
          className
        )}
      >
        <div className="flex-1 space-y-4 overflow-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leave</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={team.name}
                    className="truncate pr-20"
                  />
                </FormControl>
                <FormDescription>Type the team name to leave.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="destructive"
          disabled={loading || !form.formState.isValid}
        >
          Leave
          {loading ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucideDoorOpen className="mr-2 size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
