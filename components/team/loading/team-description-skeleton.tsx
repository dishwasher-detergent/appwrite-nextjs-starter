import { Skeleton } from "@/components/ui/skeleton";

export function TeamDescriptionSkeleton() {
  return (
    <div className="max-w-prose">
      <Skeleton className="h-8 w-60 mb-2" />
      <section aria-label="About">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
        </div>
      </section>
    </div>
  );
}
