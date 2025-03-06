import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const user = await getLoggedInUser();

  return (
    <div className="w-dvw h-dvh flex flex-col gap-2 justify-center items-center">
      <p>Public Marketing Page</p>
      {user ? (
        <Button asChild>
          <Link href="/app">Go to App</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      )}
    </div>
  );
}
