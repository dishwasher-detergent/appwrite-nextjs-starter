import { getUser } from "@/lib/db/queries";

export default async function ProfilePage() {
  const { data } = await getUser();

  return (
    <>
      <h2 className="font-bold text-xl">{data?.name}</h2>
      <p>{data?.email}</p>
    </>
  );
}
