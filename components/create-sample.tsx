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
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/sample.constants";
import { SAMPLE_BUCKET_ID } from "@/lib/constants";
import { createSample } from "@/lib/db";
import { AddSampleFormData, addSampleSchema } from "@/lib/db/schemas";
import { uploadSampleImage } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ImageInput } from "./ui/image-input";

export function AddSample() {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Sample"
      description="Create a new Sample"
      open={open}
      setOpen={setOpen}
      button={
        <Button size="sm">
          Add Sample
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

  const form = useForm<AddSampleFormData>({
    resolver: zodResolver(addSampleSchema),
    defaultValues: {
      name: "",
      description: "",
      image: null,
    },
  });

  async function onSubmit(values: AddSampleFormData) {
    setLoading(true);

    if (values.image instanceof File) {
      const image = await uploadSampleImage({
        data: values.image,
      });

      if (!image.success) {
        toast.error(image.message);
        setLoading(false);
        return;
      }

      values.image = image.data?.$id;
    }

    const data = await createSample({
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
        <div className="h-full space-y-4 overflow-auto p-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Name your sample."
                      className="truncate pr-20"
                      maxLength={NAME_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      variant="secondary"
                    >
                      {field?.value?.length}/{NAME_MAX_LENGTH}
                    </Badge>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      {...field}
                      placeholder="Describe your sample."
                      className="pb-8"
                      maxLength={DESCRIPTION_MAX_LENGTH}
                    />
                    <Badge
                      className="absolute bottom-2 left-2"
                      variant="secondary"
                    >
                      {field?.value?.length ?? 0}/{DESCRIPTION_MAX_LENGTH}
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
        <Button type="submit" disabled={loading || !form.formState.isValid}>
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
