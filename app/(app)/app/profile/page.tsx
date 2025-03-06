import { EditProfile } from "@/components/edit-profile";
import { getUser } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { data } = await getUser();

  if (!data) {
    redirect("/app");
  }

  return (
    <div className="flex flex-row justify-between">
      <div>
        <h2 className="font-bold text-xl">{data?.name}</h2>
        <p>{data?.email}</p>
      </div>
      <div className="flex flex-row gap-1">
        <EditProfile user={data} />
      </div>
    </div>
  );
}
