import { AddProduct } from "@/components/product/create-product";
import { Products } from "@/components/realtime/products";
import { CreateTeam } from "@/components/team/create-team";
import { listProducts } from "@/lib/db";
import { listTeams } from "@/lib/team";
import { Query } from "node-appwrite";

export default async function AppPage() {
  const { data } = await listProducts([Query.orderDesc("$createdAt")]);
  const { data: teams } = await listTeams();

  return (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Products</h2>
        {teams && teams?.length > 0 ? (
          <AddProduct teams={teams} />
        ) : (
          <CreateTeam />
        )}
      </header>
      <Products initialProducts={data?.documents} />
    </>
  );
}
