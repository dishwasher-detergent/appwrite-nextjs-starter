import { DeleteSample } from "@/components/delete-sample";
import { EditSample } from "@/components/edit-sample";
import { getSampleById } from "@/lib/db/queries";

import { redirect } from "next/navigation";

export default async function SamplePage({
  params,
}: {
  params: Promise<{ sample: string }>;
}) {
  const { sample: sampleId } = await params;
  const { data, success } = await getSampleById(sampleId);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <div className="flex flex-row justify-between">
      <div>
        <h2 className="font-bold text-xl">{data?.name}</h2>
        <p>{data?.description}</p>
      </div>
      <div className="flex flex-row gap-1">
        <EditSample sample={data} />
        <DeleteSample sample={data} />
      </div>
    </div>
  );
}
