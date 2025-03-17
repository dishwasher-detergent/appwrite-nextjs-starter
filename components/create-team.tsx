"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Permission, Role } from "node-appwrite";

import { ADMIN_ROLE } from "@/constants/team.constants";
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
import { SAMPLE_BUCKET_ID } from "@/lib/constants";
import { createTeam } from "@/lib/team";
import { AddTeamFormData, addTeamSchema } from "@/lib/team/schema";
import { uploadAvatarImage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ImageInput } from "@/components/ui/image-input";

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
      image: null,
    },
  });

  async function onSubmit(values: AddTeamFormData) {
    setLoading(true);

    const data = await createTeam({
        data: values,
    });

    if(!data.data || !success) {
      // Show toast or something
      return;
    }

    if (values.image instanceof File) {
        const image = await uploadAvatarImage({
            data: values.image,
            permissions: [
                Permission.read(Role.team(data.data.$id)),
                Permission.write(Role.team(data.data.$id, ADMIN_ROLE)),
            ]
        });

        if (!image.success) {
            toast.error(image.message);
            setLoading(false);
            return;
        }

        values.image = image.data?.$id;
    }

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
          "grid flex-1 items-start gap-4 overflow-hidden",
          className
        )}
      >
        <div className="h-full space-y-4 overflow-auto p-1">
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
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Picture</FormLabel>
                <FormControl>
                  <ImageInput bucketId={SAMPLE_BUCKET_ID} {...field} />
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
