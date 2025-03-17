"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSession } from "@/hooks/userSession";
import { Sample } from "@/interfaces/sample.interface";
import { getUserById } from "@/lib/auth";
import { DATABASE_ID, SAMPLE_COLLECTION_ID } from "@/lib/constants";

interface Props {
  initialSample: Sample;
}

export const useSample = ({ initialSample }: Props) => {
  const router = useRouter();
  const [sample, setSample] = useState<Sample>(initialSample);
  const [loading, setLoading] = useState<boolean>(true);

  const { client, loading: sessionLoading } = useSession();

  useEffect(() => {
    setLoading(sessionLoading);
  }, [sessionLoading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<Sample>(
        `databases.${DATABASE_ID}.collections.${SAMPLE_COLLECTION_ID}.documents.${sample?.$id}`,
        async (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.update"
            )
          ) {
            const { data } = await getUserById(response.payload.userId);

            setSample({
              user: data,
              ...response.payload,
            });
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
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

  return { sample, loading };
};
