import { AddSample } from "@/components/create-sample";
import { SampleCard } from "@/components/sample-card";
import { getSamples } from "@/lib/db";

export default async function AppPage() {
  const { data } = await getSamples();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4">
        <h2 className="font-bold">Samples</h2>
        <AddSample />
      </header>
      <section className="min-h-full columns-xs items-start gap-4 space-y-4">
        {data?.documents?.map((sample) => (
          <SampleCard key={sample.$id} {...sample} />
        ))}
      </section>
    </>
  );
}
