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
import { Separator } from "@/components/ui/separator";
import { signInWithEmail, signUpWithGithub } from "@/lib/auth";
import { signInSchema, type SignInFormData } from "@/lib/auth/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideGithub, LucideLoader2, LucideLogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormData) {
    try {
      setLoading(true);
      const result = await signInWithEmail(values);

      if (result.success) {
        toast.success(result.message);
        router.push(result.redirect!);
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
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?
          <Button
            variant="link"
            asChild
            className="text-muted-foreground p-1 text-sm"
          >
            <Link href="/signup" className="underline">
              Sign Up Here
            </Link>
          </Button>
        </p>
        <p className="text-sm text-muted-foreground">
          Forgot your password?
          <Button
            variant="link"
            asChild
            className="text-muted-foreground p-1 text-sm"
          >
            <Link href="/recover" className="underline">
              Reset Here
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
