"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DyanmicDrawer } from "@/components/ui/dynamic-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  TEAM_ABOUT_MAX_LENGTH,
  TEAM_NAME_MAX_LENGTH,
} from "@/constants/team.constants";
import { createTeam } from "@/lib/team";
import { AddTeamFormData, addTeamSchema } from "@/lib/team/schemas";
import { cn } from "@/lib/utils";

export function CreateTeam() {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Team"
      description="Create a new Team"
      open={open}
      setOpen={setOpen}
      button={
        <Button size="sm">
          Create Team
          <LucidePlus className="ml-2 size-3.5" />
        </Button>
      }
    >
      <CreateForm setOpen={setOpen} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
}

function CreateForm({ className, setOpen }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<AddTeamFormData>({
    resolver: zodResolver(addTeamSchema),
    defaultValues: {
      name: "",
      about: "",
    },
  });

  async function onSubmit(values: AddTeamFormData) {
    setLoading(true);

    const data = await createTeam({
      data: values,
    });

    if (data.success) {
      toast.success(data.message);
      router.push(`/app/teams/${data.data!.$id}`);
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
                <FormLabel>Team</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Name your team."
                      className="truncate pr-20"
                      maxLength={TEAM_NAME_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      variant="secondary"
                    >
                      {field?.value?.length}/{TEAM_NAME_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Describe your team."
                      className="pb-8"
                      maxLength={TEAM_ABOUT_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute bottom-2 left-2"
                      variant="secondary"
                    >
                      {field?.value?.length ?? 0}/{TEAM_ABOUT_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="sticky bottom-0"
          type="submit"
          disabled={loading || !form.formState.isValid}
        >
          Create
          {loading ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucidePlus className="mr-2 size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
