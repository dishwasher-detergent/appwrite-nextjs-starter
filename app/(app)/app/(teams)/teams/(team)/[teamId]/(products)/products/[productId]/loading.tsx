import { CreatorSkeleton } from "@/components/loading/creator-skeleton";
import { DescriptionSkeleton } from "@/components/loading/description-skeleton";
import { HeaderSkeleton } from "@/components/loading/header-skeleton";

export default function ProductLoading() {
  return (
    <article className="space-y-6">
      <HeaderSkeleton />
      <main className="px-4 space-y-6">
        <CreatorSkeleton />
        <DescriptionSkeleton />
      </main>
    </article>
  );
}
