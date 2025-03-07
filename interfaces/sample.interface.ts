import { Models } from "node-appwrite";

export interface Sample extends Models.Document {
  name: string;
  description?: string;
  image?: string;
}
