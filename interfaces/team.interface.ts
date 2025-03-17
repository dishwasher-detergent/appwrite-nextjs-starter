import { Models } from "node-appwrite";

export interface TeamData extends Models.Document {
  avatar: string;
  about: string;
  name: string;
  members?: Models.Membership[];
}

export interface Team extends Models.Team<Models.Preferences>, TeamData {}
