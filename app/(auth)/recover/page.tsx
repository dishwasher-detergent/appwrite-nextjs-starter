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
import { RecoverForm } from "./form";

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a password reset
          link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecoverForm />
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
          Remember your password?
          <Button
            variant="link"
            asChild
            className="text-muted-foreground p-1 text-sm"
          >
            <Link href="/signin" className="underline">
              Sign In Here
            </Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
