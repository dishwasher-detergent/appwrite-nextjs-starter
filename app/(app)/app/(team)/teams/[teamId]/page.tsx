import { LucideEllipsisVertical, LucideStar } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { DeleteTeam } from "@/components/delete-team";
import { DemoteMemberAdmin } from "@/components/demote-admin";
import { EditTeam } from "@/components/edit-team";
import { InviteTeam } from "@/components/invite-team";
import { LeaveTeam } from "@/components/leave-team";
import { PromoteMemberAdmin } from "@/components/promote-admin";
import { RemoveTeamMember } from "@/components/remove-team-member";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_ROLE, OWNER_ROLE } from "@/constants/team.constants";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { getCurrentUserRoles, getTeamById } from "@/lib/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const { data, success } = await getTeamById(teamId);
  const { data: roles } = await getCurrentUserRoles(teamId);

  const isOwner = roles?.includes(OWNER_ROLE);
  const isAdmin = roles?.includes(ADMIN_ROLE);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <article className="space-y-6">
      <header className="relative">
        <div
          role="img"
          aria-label="Team banner"
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
                <InviteTeam team={data} />
                <LeaveTeam team={data} />
                {(isAdmin || isOwner) && (
                  <>
                    <EditTeam team={data} />
                    <DeleteTeam team={data} />
                  </>
                )}
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
              {data.about ?? "Add a description to your team."}
            </p>
          </section>
        </div>
        <section>
          <h2 className="font-semibold text-lg mb-2">Admins</h2>
          <AvatarGroup
            users={data.members?.filter((user) =>
              user.roles.includes(ADMIN_ROLE)
            )}
          />
        </section>
        <section>
          <h3 className="font-semibold text-lg mb-2">Members</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead className="w-full">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.members?.map((member) => (
                  <TableRow key={member.$id}>
                    <TableCell>
                      {member.roles.includes(ADMIN_ROLE) && (
                        <LucideStar className="size-3.5 text-amber-600" />
                      )}
                    </TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.roles.join(", ")}</TableCell>
                    <TableCell>
                      {!member.roles.includes(OWNER_ROLE) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="size-8"
                            >
                              <LucideEllipsisVertical className="size-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <RemoveTeamMember
                              teamId={data.$id}
                              userId={member.$id}
                            />
                            {isOwner &&
                              member.roles.includes(ADMIN_ROLE) &&
                              !member.roles.includes(OWNER_ROLE) && (
                                <DemoteMemberAdmin
                                  teamId={data.$id}
                                  userId={member.$id}
                                />
                              )}
                            {isOwner && !member.roles.includes(ADMIN_ROLE) && (
                              <PromoteMemberAdmin
                                teamId={data.$id}
                                userId={member.$id}
                              />
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </article>
  );
}
