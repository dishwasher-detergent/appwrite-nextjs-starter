export const HOSTNAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;

export const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
export const API_KEY = process.env.APPWRITE_API_KEY as string;

// Collections
export const SAMPLE_COLLECTION_ID = process.env
  .NEXT_PUBLIC_SAMPLE_COLLECTION_ID as string;
export const USER_COLLECTION_ID = process.env
  .NEXT_PUBLIC_USER_COLLECTION_ID as string;
export const TEAM_COLLECTION_ID = process.env
  .NEXT_PUBLIC_TEAM_COLLECTION_ID as string;

// Buckets
export const SAMPLE_BUCKET_ID = process.env
  .NEXT_PUBLIC_SAMPLE_BUCKET_ID as string;
export const AVATAR_BUCKET_ID = process.env
  .NEXT_PUBLIC_AVATAR_BUCKET_ID as string;

// Cookie
export const COOKIE_KEY = `a_session_${PROJECT_ID}`;

// Additional
export const MAX_TEAM_LIMIT = Number(process.env.NEXT_PUBLIC_MAX_TEAM_LIMIT) || 3;
