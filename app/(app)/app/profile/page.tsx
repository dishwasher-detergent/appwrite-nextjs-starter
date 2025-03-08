import Image from "next/image";
import { redirect } from "next/navigation";

import { EditProfile } from "@/components/edit-profile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { getUser, getUserLogs } from "@/lib/db";

export default async function ProfilePage() {
  const { data } = await getUser();
  const { data: logs } = await getUserLogs();

  if (!data) {
    redirect("/app");
  }

  return (
    <article className="space-y-6">
      <header className="relative">
        <div
          role="img"
          aria-label="Profile banner"
          className="w-full bg-primary rounded-xl h-32"
        />
        <div className="flex items-start justify-between px-4 -mt-16">
          <figure className="relative flex-shrink-0">
            {data?.avatar ? (
              <Image
                src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${data.avatar}/view?project=${PROJECT_ID}`}
                alt={`${data.name}'s profile picture`}
                className="rounded-full border-4 border-background object-cover bg-primary aspect-square"
                width={128}
                height={128}
                priority
              />
            ) : (
              <div
                aria-label="Default profile picture"
                className="rounded-full border-4 border-background bg-muted aspect-square w-32 h-32"
              />
            )}
          </figure>
          <div className="pt-18">
            <EditProfile user={data} />
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
          <h3 className="font-semibold text-lg mb-2">User Activity</h3>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="w-full">Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.logs.map((log, id) => (
                  <TableRow key={id}>
                    <TableCell>{log.time}</TableCell>
                    <TableCell className="w-full">{log.event}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </article>
  );
}
