"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideMail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
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
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="user@example.com"
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
      </CardContent>
      <CardFooter>
        <div className="bg-muted text-muted-foreground w-full overflow-hidden rounded-md p-2 text-center text-sm font-bold">
          <p>
            Don&apos;t have an account?
            <Button
              variant="link"
              asChild
              className="text-muted-foreground p-1 font-bold"
            >
              <Link href="/signup" className="underline">
                Sign Up Here
              </Link>
            </Button>
          </p>
          <p>
            Remember your password?
            <Button
              variant="link"
              asChild
              className="text-muted-foreground p-1 text-sm font-bold"
            >
              <Link href="/signin" className="underline">
                Sign In Here
              </Link>
            </Button>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
