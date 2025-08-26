import { Models } from "node-appwrite";

import { UserMemberData } from "@/interfaces/user.interface";

export interface TeamData extends Models.Document {
  avatar?: string | null;
  about: string;
  name: string;
  members?: UserMemberData[];
  description?: string;
}

export interface Team extends Models.Team<Models.Preferences>, TeamData {}
