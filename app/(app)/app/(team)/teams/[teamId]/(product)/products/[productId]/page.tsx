import { redirect } from "next/navigation";

import { Product } from "@/components/realtime/product";
import { getLoggedInUser } from "@/lib/auth";
import { getProductById } from "@/lib/db";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const { data, success } = await getProductById(productId);

  if (!success || !data) {
    redirect("/app");
  }

  const user = await getLoggedInUser();
  const isOwnProduct = user?.$id === data?.userId;

  return <Product initialProduct={data} canEdit={isOwnProduct} />;
}
