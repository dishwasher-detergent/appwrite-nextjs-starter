import { EditProfile } from "@/components/edit-profile";
import { getUser } from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { data } = await getUser();

  if (!data) {
    redirect("/app");
  }

  return (
    <>
      <h2 className="font-bold text-xl">{data?.name}</h2>
      <p>{data?.email}</p>
      <div className="flex flex-row gap-1">
        <EditProfile user={data} />
      </div>
    </>
  );
}
