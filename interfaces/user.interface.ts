import { Models } from "node-appwrite";

export interface UserData extends Models.Document {
  avatar: string;
}

export interface User extends Models.User<Models.Preferences>, UserData {}
