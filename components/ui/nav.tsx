import { UserInformation } from "@/components/user-information";
import { getUser } from "@/lib/auth";

import Link from "next/link";
import { ModeToggle } from "../theme-toggle";

export async function Nav() {
  const { data } = await getUser();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/90 backdrop-blur-xs">
      <div className="mx-auto flex max-w-6xl flex-row items-center justify-between gap-2 px-4 py-2 md:px-8">
        <h1 className="font-bold">
          <Link href="/app">Appwrite NextJS Starter</Link>
        </h1>
        <div className="flex flex-row items-center gap-2">
          <ModeToggle />
          {data && <UserInformation user={data} />}
        </div>
      </div>
    </header>
  );
}
