"use server";

import { API_KEY, COOKIE_KEY, ENDPOINT, PROJECT_ID } from "@/lib/constants";

import { cookies } from "next/headers";
import {
  Account,
  Client,
  Databases,
  Storage,
  Teams,
} from "node-appwrite";

export async function createSessionClient(setSession: boolean = true) {
  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  if (setSession) {
    const session = (await cookies()).get(COOKIE_KEY);
    if (!session || !session.value) {
      throw new Error("No session");
    }

    client.setSession(session.value);
  }

  return {
    get account() {
      return new Account(client);
    },
    get team() {
      return new Teams(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get client() {
      return client;
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  return {
    get account() {
      return new Account(client);
    },
    get team() {
      return new Teams(client);
    },
  };
}
