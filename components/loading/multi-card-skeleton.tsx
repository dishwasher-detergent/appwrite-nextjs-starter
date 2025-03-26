import { Skeleton } from "@/components/ui/skeleton";

export function MultiCardSkeleton() {
  return (
    <section className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className="w-full aspect-square" />
      ))}
    </section>
  );
}
