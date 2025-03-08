import { AddSample } from "@/components/create-sample";
import { SampleCard } from "@/components/sample-card";
import { getSamples } from "@/lib/db";

export default async function AppPage() {
  const { data } = await getSamples();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Samples</h2>
        <AddSample />
      </header>
      <section className="min-h-full columns-xs items-start gap-4 space-y-4 w-full">
        {data?.documents?.map((sample) => (
          <SampleCard key={sample.$id} {...sample} />
        ))}
        {data?.documents?.length === 0 && (
          <p className="font-semibold text-muted-foreground">
            No samples found
          </p>
        )}
      </section>
    </>
  );
}
