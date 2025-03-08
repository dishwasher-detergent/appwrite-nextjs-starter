import { redirect } from "next/navigation";
import Image from "next/image";

import { Modal } from "../../modal";
import { getSampleById } from "@/lib/db";
import { ENDPOINT, PROJECT_ID, SAMPLE_BUCKET_ID } from "@/lib/constants";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DeleteSample } from "@/components/delete-sample";
import { EditSample } from "@/components/edit-sample";

export default async function SampleModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: sampleId } = await params;
  const { data, success } = await getSampleById(sampleId);

  if (!success || !data) {
    redirect("/app");
  }

  return (
    <Modal>
      <div className="border-b">
        {data?.image ? (
          <Image
            src={`${ENDPOINT}/storage/buckets/${SAMPLE_BUCKET_ID}/files/${data?.image}/view?project=${PROJECT_ID}`}
            alt={data?.name}
            className="object-cover bg-primary rounded-t-md"
            width={500}
            height={250}
            sizes="(max-width: 500px)"
          />
        ) : (
          <div className="w-full aspect-video bg-muted rounded-t-md">
            <p className="flex h-full items-center justify-center text-muted-foreground font-semibold">
              No image
            </p>
          </div>
        )}
      </div>
      <DialogHeader className="p-4">
        <DialogTitle>{data?.name}</DialogTitle>
        <DialogDescription className="truncate">
          {data?.description}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-row justify-end gap-1 p-4">
        <DeleteSample sample={data} />
        <EditSample sample={data} />
      </DialogFooter>
    </Modal>
  );
}
