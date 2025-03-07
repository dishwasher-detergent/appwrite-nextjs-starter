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
import { Textarea } from "@/components/ui/textarea";
import { updateSample } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Sample } from "@/interfaces/sample.interface";
import { EditSampleFormData, editSampleSchema } from "@/lib/db/schemas";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/sample.constants";
import { ImageInput } from "@/components/ui/image-input";
import { deleteSampleImage, uploadSampleImage } from "@/lib/storage";

export function EditSample({ sample }: { sample: Sample }) {
  const [open, setOpen] = useState(false);

  return (
    <DyanmicDrawer
      title="Edit Sample"
      description="Edit an existing Sample"
      open={open}
      setOpen={setOpen}
      button={
        <Button size="icon">
          <LucidePencil className="size-3.5" />
        </Button>
      }
    >
      <CreateForm setOpen={setOpen} sample={sample} />
    </DyanmicDrawer>
  );
}

interface FormProps extends React.ComponentProps<"form"> {
  setOpen: (e: boolean) => void;
  sample: Sample;
}

function CreateForm({ className, setOpen, sample }: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<EditSampleFormData>({
    resolver: zodResolver(editSampleSchema),
    defaultValues: {
      name: sample.name,
      description: sample.description,
      image: sample.image,
    },
  });

  async function onSubmit(values: EditSampleFormData) {
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
    } else if (values.image === null && sample.image) {
      const image = await deleteSampleImage(sample.image);

      if (!image.success) {
        toast.error(image.message);
        setLoading(false);
        return;
      }

      values.image = null;
    }

    const data = await updateSample({
      id: sample.$id,
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
