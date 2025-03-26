import { ContentSkeleton } from "@/components/loading/content-skeleton";
import { DescriptionSkeleton } from "@/components/loading/description-skeleton";
import { HeaderSkeleton } from "@/components/loading/header-skeleton";

export default function Loading() {
  return (
    <article className="space-y-6">
      <HeaderSkeleton />
      <main className="px-4 space-y-6">
        <DescriptionSkeleton />
        <ContentSkeleton title="Products" />
      </main>
    </article>
  );
}
