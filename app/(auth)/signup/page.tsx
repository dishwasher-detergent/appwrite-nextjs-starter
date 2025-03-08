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
import { SignUpForm } from "./form";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Already have an account?
          <Button
            variant="link"
            asChild
            className="text-muted-foreground p-1 text-sm"
          >
            <Link href="/signin" className="underline">
              Sign In here
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
