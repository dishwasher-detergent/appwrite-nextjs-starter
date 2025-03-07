import { EditProfile } from "@/components/edit-profile";
import { AVATAR_BUCKET_ID, ENDPOINT, PROJECT_ID } from "@/lib/constants";
import { getUser } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { data } = await getUser();

  if (!data) {
    redirect("/app");
  }

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row gap-2">
        {data?.avatar && (
          <img
            src={`${ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${data.avatar}/view?project=${PROJECT_ID}`}
            alt={data?.name}
            className="size-20 rounded-md object-cover bg-primary"
          />
        )}
        <div>
          <h2 className="font-bold text-xl">{data?.name}</h2>
          <p>{data?.email}</p>
        </div>
      </div>
      <div className="flex flex-row gap-1">
        <EditProfile user={data} />
      </div>
    </div>
  );
}
