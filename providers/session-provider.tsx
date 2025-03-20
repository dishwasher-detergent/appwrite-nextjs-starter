"use client";

import { getLoggedInUser } from "@/lib/client/appwrite";
import { Client, Models } from "appwrite";
import { createContext, ReactNode, useEffect, useState } from "react";

interface SessionContextType {
  client: Client | null;
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  refreshUser: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: Models.User<Models.Preferences> | null;
}) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    initialUser
  );
  const [loading, setLoading] = useState(initialUser === null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (initialUser) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await getLoggedInUser();
        setUser(response.user);
        setClient(response.client);
      } catch (error) {
        setUser(null);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [initialUser]);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const response = await getLoggedInUser();
      setUser(response.user);
      setClient(response.client);
    } catch (error) {
      setUser(null);
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, setUser, refreshUser, client }}
    >
      {children}
    </SessionContext.Provider>
  );
}
