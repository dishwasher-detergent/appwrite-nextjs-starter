import { getSampleById } from "@/lib/db/queries";

import { redirect } from "next/navigation";

export default async function SamplePage({
  params,
}: {
  params: Promise<{ sample: string }>;
}) {
  const { sample: sampleId } = await params;
  const { data, success } = await getSampleById(sampleId);

  if (!success) {
    redirect("/app");
  }

  return (
    <>
      <h2 className="font-bold text-xl">{data?.name}</h2>
      <p>{data?.description}</p>
    </>
  );
}
