import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

import { UserContent } from "@/components/user/user-content";
import { UserDescription } from "@/components/user/user-description";
import { UserHeader } from "@/components/user/user-header";
import { getLoggedInUser, getUserById } from "@/lib/auth";
import { listProducts } from "@/lib/db";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const user = await getLoggedInUser();
  const { userId } = await params;
  const { data } = await getUserById(userId);

  if (!data) {
    redirect("/app");
  }

  const { data: productData } = await listProducts([
    Query.orderDesc("$createdAt"),
    Query.equal("userId", userId),
  ]);

  const isOwnProfile = user?.$id === userId;

  return (
    <article className="space-y-6">
      <UserHeader user={data} canEdit={isOwnProfile} />
      <main className="px-4 space-y-6">
        <UserDescription user={data} />
        <UserContent products={productData?.documents ?? []} userId={userId} />
      </main>
    </article>
  );
}
