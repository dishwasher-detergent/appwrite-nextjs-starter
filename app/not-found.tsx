import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-5">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">404</h1>
          <h2 className="text-3xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
