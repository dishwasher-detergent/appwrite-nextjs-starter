import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./form";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignInForm />
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
