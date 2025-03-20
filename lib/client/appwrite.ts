"use client";

import { COOKIE_KEY, ENDPOINT, PROJECT_ID } from "@/lib/constants";

import { Account, Client, Teams } from "appwrite";
import Cookies from "js-cookie";
import { unstable_cache } from "next/cache";

export async function createClient() {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  const req = await fetch("/api/auth/session");

  const { session } = await req.json();

  if (session) {
    client.setSession(session.value);

    Cookies.set(COOKIE_KEY, session.value);
    Cookies.set(`${COOKIE_KEY}_legacy`, session.value);

    // Set session in localStorage for legacy support
    const cookieFallback = {
      [COOKIE_KEY]: session.value,
      [`${COOKIE_KEY}_legacy`]: session.value,
    };

    localStorage.setItem("cookieFallback", JSON.stringify(cookieFallback));
  }

  return {
    get account() {
      return new Account(client);
    },
    get team() {
      return new Teams(client);
    },
    client,
  };
}

export const getLoggedInUser = unstable_cache(
  async () => {
    try {
      const client = await createClient();
      return {
        user: await client.account.get(),
        client: client.client,
      };
    } catch {
      return {
        user: null,
        client: null,
      };
    }
  },
  ["client_user"],
  {
    tags: ["client_user"],
    revalidate: 600,
  }
);
