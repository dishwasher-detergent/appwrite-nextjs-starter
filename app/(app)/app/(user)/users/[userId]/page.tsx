import { LucideEllipsisVertical } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { EditProfile } from "@/components/edit-profile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Samples } from "@/components/realtime/samples";
import { listSamples } from "@/lib/db";
import { getUserById } from "@/lib/auth";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { data } = await getUserById(userId);
  const { data: sampleData } = await listSamples([
    Query.orderDesc("$createdAt"),
    Query.equal("userId", userId),
  ]);

  if (!data) {
    redirect("/app");
  }

  return (
    <article className="space-y-6">
      <header className="relative">
        <div
          role="img"
          aria-label="User banner"
          className="w-full bg-linear-to-r from-primary to-secondary rounded-xl h-48"
        />
        <div className="flex items-start justify-between px-4 -mt-30">
          <figure className="relative flex-shrink-0 size-60">
            <AspectRatio ratio={1}>
              {data?.avatar ? (
                <Image
                  src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${data.avatar}/view?project=${PROJECT_ID}`}
                  alt={`${data.name}'s picture`}
                  className="rounded-full border-4 border-background object-cover bg-primary size-full"
                  fill
                  priority
                />
              ) : (
                <div
                  aria-label="Default picture"
                  className="rounded-full border-4 border-background object-cover bg-primary size-full text-primary-foreground grid place-items-center font-bold"
                >
                  No Image
                </div>
              )}
            </AspectRatio>
          </figure>
          <div className="pt-32 flex flex-row gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="size-8">
                  <LucideEllipsisVertical className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <EditProfile user={data} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="px-4 space-y-6">
        <div className="max-w-prose">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {data.name}
          </h1>
          <section aria-label="About">
            <p className="text-muted-foreground leading-relaxed">
              {data.about ?? "Add a description to your profile."}
            </p>
          </section>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Samples</h3>
          <Samples initialSamples={sampleData?.documents} userId={userId} />
        </div>
      </main>
    </article>
  );
}
