"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideMail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPasswordRecovery } from "@/lib/auth";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth/schemas";

export function RecoverForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormData) {
    try {
      setLoading(true);

      const result = await createPasswordRecovery(values);

      if (result.success) {
        toast.success(result.message);
        router.push("/reset");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="user@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={loading || !form.formState.isValid}
        >
          {loading ? (
            <>
              Sending Reset Link
              <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
            </>
          ) : (
            <>
              Send Reset Link
              <LucideMail className="ml-2 size-3.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
