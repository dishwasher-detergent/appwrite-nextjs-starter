import { Models } from "node-appwrite";

import { TeamData } from "@/interfaces/team.interface";
import { UserData } from "@/interfaces/user.interface";

export interface Product extends Models.Document {
  name: string;
  description?: string;
  image?: string;
  userId: string;
  user?: UserData;
  teamId: string;
  team?: TeamData;
}
