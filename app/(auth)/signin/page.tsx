import { SignInFooter } from "@/components/signin-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "./form";

export default function SignInPage() {
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
        <SignInFooter />
      </CardFooter>
    </Card>
  );
}
