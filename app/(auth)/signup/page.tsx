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
import { signUpWithEmail, signUpWithGithub } from "@/lib/auth";
import { signUpSchema, type SignUpFormData } from "@/lib/auth/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { LucideLoader2, LucideUserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpFormData) {
    try {
      setLoading(true);
      const result = await signUpWithEmail(values);

      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  Signing up
                  <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
                </>
              ) : (
                <>
                  Sign Up
                  <LucideUserPlus className="ml-2 size-3.5" />
                </>
              )}
            </Button>
          </form>
        </Form>
        <form action={signUpWithGithub}>
          <Button type="submit">Github</Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="bg-muted text-muted-foreground w-full overflow-hidden rounded-md p-2 text-center text-sm font-bold">
          Already have an account?
          <Button
            variant="link"
            asChild
            className="text-muted-foreground p-1 text-sm font-bold"
          >
            <Link href="/signin" className="underline">
              Sign In here
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
