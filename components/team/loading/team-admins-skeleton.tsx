import { Skeleton } from "@/components/ui/skeleton";

export function TeamAdminsSkeleton() {
  return (
    <section>
      <h2 className="font-semibold text-lg mb-2">Admins</h2>
      <div className="flex -space-x-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="rounded-full size-10 border-2 border-background"
          />
        ))}
      </div>
    </section>
  );
}
