import { Models } from "node-appwrite";

import { UserMemberData } from "@/interfaces/user.interface";

export interface TeamData extends Models.Document {
  avatar: string;
  about: string;
  name: string;
  members?: UserMemberData[];
}

export interface Team extends Models.Team<Models.Preferences>, TeamData {}
