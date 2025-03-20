"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/hooks/userSession";
import { Product } from "@/interfaces/product.interface";
import { getUserById } from "@/lib/auth";
import { DATABASE_ID, SAMPLE_COLLECTION_ID } from "@/lib/constants";
import { getTeamById } from "@/lib/team";

interface Props {
  initialProducts?: Product[];
  teamId?: string;
  userId?: string;
}

export const useProducts = ({ initialProducts, teamId, userId }: Props) => {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [loading, setLoading] = useState<boolean>(true);

  const { client, loading: sessionLoading } = useSession();

  useEffect(() => {
    setLoading(sessionLoading);
  }, [sessionLoading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<Product>(
        `databases.${DATABASE_ID}.collections.${SAMPLE_COLLECTION_ID}.documents`,
        async (response) => {
          if (teamId && response.payload.teamId !== teamId) return;
          if (userId && response.payload.userId !== userId) return;

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId
            );

            setProducts((prev) => [
              {
                ...response.payload,
                user: data,
                team: teamData,
              },
              ...prev,
            ]);
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId
            );

            setProducts((prev) =>
              prev.map((x) =>
                x.$id === response.payload.$id
                  ? { user: data, ...response.payload, team: teamData }
                  : x
              )
            );
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            setProducts((prev) =>
              prev.filter((x) => x.$id !== response.payload.$id)
            );
          }
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [client]);

  return { products, loading };
};
