"use client";

import { createClient } from "@/lib/client/appwrite";
import { Client } from "appwrite";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

import { SessionContext } from "@/providers/session-provider";

export const useSession = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>("");
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const { client: newClient } = await createClient();
      setClient(newClient);
    } catch (error) {
      console.error("Failed to refresh session:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (currentPath === "") {
      setCurrentPath(window.location.pathname);
      return;
    }

    // If path changed, refresh the session
    if (currentPath !== window.location.pathname) {
      refreshSession();
      setCurrentPath(window.location.pathname);
    }
  }, [router, currentPath, refreshSession]);

  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components");
  }

  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return { ...context, client, loading, refreshSession };
};
