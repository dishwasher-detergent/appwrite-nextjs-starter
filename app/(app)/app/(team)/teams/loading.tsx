import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Your Teams</h2>
        <Skeleton className="w-[120px] h-8" />
      </header>
      <MultiCardSkeleton />
    </>
  );
}
