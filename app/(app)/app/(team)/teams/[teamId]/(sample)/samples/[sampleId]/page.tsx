import { redirect } from "next/navigation";

import { Sample } from "@/components/realtime/sample";
import { getLoggedInUser } from "@/lib/auth";
import { getSampleById } from "@/lib/db";

export default async function SamplePage({
  params,
}: {
  params: Promise<{ sampleId: string }>;
}) {
  const { sampleId } = await params;
  const { data, success } = await getSampleById(sampleId);
  const user = await getLoggedInUser();
  const isOwnSample = user?.$id === data?.userId;

  if (!success || !data) {
    redirect("/app");
  }

  return <Sample initialSample={data} canEdit={isOwnSample} />;
}
