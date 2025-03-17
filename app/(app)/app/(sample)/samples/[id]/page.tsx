import { redirect } from "next/navigation";

import { Sample } from "@/components/realtime/sample";
import { getSampleById } from "@/lib/db";

export default async function SamplePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sampleId } = await params;
  const { data, success } = await getSampleById(sampleId);

  if (!success || !data) {
    redirect("/app");
  }

  return <Sample initialSample={data} />;
}
