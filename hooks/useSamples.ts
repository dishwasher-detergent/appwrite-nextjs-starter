"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/hooks/userSession";
import { Sample } from "@/interfaces/sample.interface";
import { DATABASE_ID, SAMPLE_COLLECTION_ID } from "@/lib/constants";
import { getUserById } from "@/lib/db";
import { getTeamById } from "@/lib/team";

interface Props {
  initialSamples?: Sample[];
  teamId?: string;
}

export const useSamples = ({ initialSamples, teamId }: Props) => {
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
        async (response) => {
          if (teamId && response.payload.teamId !== teamId) return;

          if (
            response.events.includes(
              "databases.*.collections.*.documents.*.create"
            )
          ) {
            const { data } = await getUserById(response.payload.userId);
            const { data: teamData } = await getTeamById(
              response.payload.teamId
            );

            setSamples((prev) => [
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

            setSamples((prev) =>
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

  return { samples, loading };
};
