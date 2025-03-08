import { RecoveryFooter } from "@/components/recovery-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecoverForm } from "./form";

export default function RecoverPasswordPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Password Recovery</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a password reset
          link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecoverForm />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <RecoveryFooter />
      </CardFooter>
    </Card>
  );
}
