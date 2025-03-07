"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucidePencil } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { UpdateProfileFormData, updateProfileSchema } from "@/lib/auth/schemas";
import { updateProfile } from "@/lib/auth";
import { PROFILE_NAME_MAX_LENGTH } from "@/constants/profile.constants";
import { ImageInput } from "@/components/ui/image-input";
import { deleteAvatarImage, uploadAvatarImage } from "@/lib/storage";
import { User } from "@/interfaces/user.interface";

export function EditProfile({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Edit Profile"
      description="Edit your profile."
      open={open}
      setOpen={setOpen}
      button={
        <Button size="icon">
          <LucidePencil className="size-3.5" />
        </Button>
      }
    >
      <EditForm setOpen={setOpen} user={user} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
  user: User;
}

function EditForm({ className, setOpen, user }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      avatar: user.avatar
    },
  });

  async function onSubmit(values: UpdateProfileFormData) {
    setLoading(true);

    if (values.image instanceof File) {
      const image = await uploadAvatarImage({
        data: values.image,
      });

      if (!image.success) {
        toast.error(image.message);
        setLoading(false);
        return;
      }

      values.image = image.data?.$id;
    } else if (values.image === null && user.avatar) {
      const image = await deleteAvatarImage(user.avatar);

      if (!image.success) {
        toast.error(image.message);
        setLoading(false);
        return;
      }

      values.image = null;
    }

    const data = await updateProfile({
      id: user.$id,
      data: values,
    });

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
        <div className="h-full space-y-2 overflow-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Name your sample."
                      className="truncate pr-20"
                      maxLength={PROFILE_NAME_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      variant="secondary"
                    >
                      {field?.value?.length}/{PROFILE_NAME_MAX_LENGTH}
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
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <ImageInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading || !form.formState.isValid}>
          Edit
          {loading ? (
            <LucideLoader2 className="mr-2 size-3.5 animate-spin" />
          ) : (
            <LucidePencil className="mr-2 size-3.5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
