import {
  TeamAdminsSkeleton,
  TeamContentSkeleton,
  TeamDescriptionSkeleton,
  TeamHeaderSkeleton,
  TeamMembersSkeleton,
} from "@/components/team/loading";

export default function TeamLoading() {
  return (
    <article className="space-y-6">
      <TeamHeaderSkeleton />
      <main className="px-4 space-y-6">
        <TeamDescriptionSkeleton />
        <TeamAdminsSkeleton />
        <TeamMembersSkeleton />
        <TeamContentSkeleton />
      </main>
    </article>
  );
}
