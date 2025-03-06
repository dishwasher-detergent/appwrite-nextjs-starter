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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail } from "./action";

import { LucideLoader2, LucideUserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
  success: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    signUpWithEmail,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/app");
    }

    if (!state.success && state.message != "") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to create to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              name="password"
              placeholder="Password"
              minLength={8}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isPending}>
            Sign Up
            {isPending ? (
              <LucideLoader2 className="ml-2 size-3.5 animate-spin" />
            ) : (
              <LucideUserPlus className="ml-2 size-3.5" />
            )}
          </Button>
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
            <Link href="/login" className="underline">
              Sign In here
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
