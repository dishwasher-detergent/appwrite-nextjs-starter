import { MultiCardSkeleton } from "@/components/loading/multi-card-skeleton";

interface ContentSkeletonProps {
  title: string;
}

export function ContentSkeleton({ title }: ContentSkeletonProps) {
  return (
    <div>
      <h2 className="font-semibold text-lg mb-2">{title}</h2>
      <MultiCardSkeleton />
    </div>
  );
}
