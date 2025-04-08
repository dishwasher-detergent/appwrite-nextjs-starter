"use client";

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
import { resetPassword } from "@/lib/auth";
import {
  newPasswordSchema,
  type NewPasswordFormData,
} from "@/lib/auth/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideLock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const secret = searchParams.get("secret");
  const userId = searchParams.get("userId");

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  if (!secret || !userId) {
    router.push("/signin");
    return null;
  }

  async function onSubmit(values: NewPasswordFormData) {
    if (!userId || !secret) {
      return;
    }

    setLoading(true);
    const result = await resetPassword(userId, secret, values.password);
    toast.error(result.message);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm new password"
                />
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
              Resetting Password
              <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
            </>
          ) : (
            <>
              Reset Password
              <LucideLock className="ml-2 size-3.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
