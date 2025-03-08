import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SignInFooter() {
  return (
    <>
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
    </>
  );
}
