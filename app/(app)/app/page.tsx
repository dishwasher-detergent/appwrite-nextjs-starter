import { AddProduct } from "@/components/product/create-product";
import { Products } from "@/components/realtime/products";
import { CreateTeam } from "@/components/team/create-team";
import { listProducts } from "@/lib/db";
import { listTeams } from "@/lib/team";
import { Query } from "node-appwrite";

export default async function AppPage() {
  const { data } = await listProducts([Query.orderDesc("$createdAt")]);
  const { data: teams } = await listTeams();

  return teams && teams?.length > 0 ? (
    <>
      <header className="flex flex-row justify-between items-center pb-4 w-full">
        <h2 className="font-bold">Products</h2>
        <AddProduct teams={teams} />
      </header>
      <Products initialProducts={data?.documents} />
    </>
  ) : (
    <section className="grid place-items-center gap-4">
      <p className="text-lg font-semibold text-center">
        Looks like you&apos;re apart of no teams yet, <br />
        join one or create one to get started!
      </p>
      <CreateTeam />
    </section>
  );
}
