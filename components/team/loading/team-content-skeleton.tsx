import { TeamCardSkeleton } from "@/components/team/loading/team-card-skeleton";

export function TeamContentSkeleton() {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">Products</h2>
      <TeamCardSkeleton />
    </div>
  );
}
