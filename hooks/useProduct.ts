"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSession } from "@/hooks/userSession";
import { Product } from "@/interfaces/product.interface";
import { getUserById } from "@/lib/auth";
import { DATABASE_ID, SAMPLE_COLLECTION_ID } from "@/lib/constants";
import { getTeamById } from "@/lib/team";

interface Props {
  initialProduct: Product;
}

export const useProduct = ({ initialProduct }: Props) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState<boolean>(true);

  const { client, loading: sessionLoading } = useSession();

  useEffect(() => {
    setLoading(sessionLoading);
  }, [sessionLoading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<Product>(
        `databases.${DATABASE_ID}.tables.${SAMPLE_COLLECTION_ID}.rows.${product?.$id}`,
        async (response) => {
          if (
            response.events.includes(
              "databases.*.tables.*.rows.*.update"
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId
            );

            setProduct({
              user: data,
              team: teamData,
              ...response.payload,
            });
          }

          if (
            response.events.includes(
              "databases.*.tables.*.rows.*.delete"
            )
          ) {
            router.push("/app");
          }
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [client]);

  return { product, loading };
};
