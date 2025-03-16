import { Models } from "node-appwrite";

import { UserData } from "@/interfaces/user.interface";

export interface Sample extends Models.Document {
  name: string;
  description?: string;
  image?: string;
  userId: string;
  user?: UserData;
}
