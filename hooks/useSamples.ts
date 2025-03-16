import { useSession } from "@/hooks/userSession";
import { Sample } from "@/interfaces/sample.interface";
import { DATABASE_ID, SAMPLE_COLLECTION_ID } from "@/lib/constants";

import { useEffect, useState } from "react";

interface Props {
  initialSamples?: Sample[];
}

export const useSamples = ({ initialSamples }: Props) => {
  const [samples, setSamples] = useState<Sample[]>(initialSamples ?? []);
  const [loading, setLoading] = useState<boolean>(true);

  const { client, loading: sessionLoading } = useSession();

  useEffect(() => {
    setLoading(sessionLoading);
  }, [sessionLoading]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (client) {
      unsubscribe = client.subscribe<Sample>(
        `databases.${DATABASE_ID}.collections.${SAMPLE_COLLECTION_ID}.documents`,
        (response) => {
          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            setSamples((prev) => [response.payload, ...prev]);
          }

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.delete"
            )
          ) {
            setSamples((prev) =>
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

  return { samples: samples, loading };
};
