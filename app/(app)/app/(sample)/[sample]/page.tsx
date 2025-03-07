import { DeleteSample } from "@/components/delete-sample";
import { EditSample } from "@/components/edit-sample";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import { getSampleById } from "@/lib/db";

import Image from "next/image";

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
      <div className="flex flex-row gap-2">
        {data?.image && (
          <Image
            src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${data.image}/view?project=${PROJECT_ID}`}
            alt={data?.name}
            className="size-20 rounded-md object-cover bg-primary"
          />
        )}
        <div>
          <h2 className="font-bold text-xl">{data?.name}</h2>
          <p>{data?.description}</p>
        </div>
      </div>
      <div className="flex flex-row gap-1">
        <EditSample sample={data} />
        <DeleteSample sample={data} />
      </div>
    </div>
  );
}
