"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideGithub, LucideLoader2, LucideLogIn } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { signInWithEmail, signUpWithGithub } from "@/lib/auth";
import { signInSchema, type SignInFormData } from "@/lib/auth/schemas";

export function SignInForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormData) {
    setLoading(true);
    const result = await signInWithEmail(values);
    toast.error(result.message);
    setLoading(false);
  }

  return (
    <>
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Password" />
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
                Signing in
                <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
              </>
            ) : (
              <>
                Sign In
                <LucideLogIn className="ml-2 size-3.5" />
              </>
            )}
          </Button>
        </form>
      </Form>
      <Separator />
      <form className="w-full" action={signUpWithGithub}>
        <Button type="submit" variant="secondary" className="w-full">
          Github
          <LucideGithub className="ml-2 size-3.5" />
        </Button>
      </form>
    </>
  );
}
