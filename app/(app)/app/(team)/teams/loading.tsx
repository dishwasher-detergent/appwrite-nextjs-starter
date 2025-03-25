import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Your Teams</h2>
        <Skeleton className="w-[120px] h-10" />
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full h-[120px] rounded-lg"
          />
        ))}
      </section>
    </>
  );
}
