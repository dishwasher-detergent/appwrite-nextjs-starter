import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="relative">
      <Skeleton className="w-full rounded-xl h-48" />
      <div className="flex items-start justify-between px-4 -mt-30">
        <figure className="relative flex-shrink-0 size-60">
          <AspectRatio ratio={1}>
            <Skeleton className="rounded-full border-4 border-background size-full" />
          </AspectRatio>
        </figure>
        <div className="pt-32 flex flex-row gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </header>
  );
}
