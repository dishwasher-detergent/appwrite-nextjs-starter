import { Skeleton } from "@/components/ui/skeleton";

export function DescriptionSkeleton() {
  return (
    <div className="max-w-prose">
      <Skeleton className="h-8 w-60 mb-2" />
      <section aria-label="Description">
        <Skeleton className="h-4 w-full" />
      </section>
    </div>
  );
}
