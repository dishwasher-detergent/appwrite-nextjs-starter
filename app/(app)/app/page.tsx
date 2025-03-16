import { AddSample } from "@/components/create-sample";
import { Samples } from "@/components/realtime/samples";
import { getSamples } from "@/lib/db";

export default async function AppPage() {
  const { data } = await getSamples();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Samples</h2>
        <AddSample />
      </header>
      <Samples initialSamples={data?.documents} />
    </>
  );
}
