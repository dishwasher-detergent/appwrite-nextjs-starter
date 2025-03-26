import { ContentSkeleton } from "@/components/loading/content-skeleton";
import { DescriptionSkeleton } from "@/components/loading/description-skeleton";
import { HeaderSkeleton } from "@/components/loading/header-skeleton";
import { MultiUserSkeleton } from "@/components/loading/multi-user-skeleton";
import { TeamMembersSkeleton } from "@/components/loading/team-members-skeleton";

export default function TeamLoading() {
  return (
    <article className="space-y-6">
      <HeaderSkeleton />
      <main className="px-4 space-y-6">
        <DescriptionSkeleton />
        <MultiUserSkeleton title="Admins" />
        <TeamMembersSkeleton />
        <ContentSkeleton title="Products" />
      </main>
    </article>
  );
}
