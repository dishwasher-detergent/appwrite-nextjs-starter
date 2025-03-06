export const HOSTNAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string;

export const ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID as string;
export const API_KEY = process.env.APPWRITE_API_KEY as string;

// Collections
export const SAMPLE_COLLECTION_ID = process.env
  .NEXT_PUBLIC_SAMPLE_COLLECTION_ID as string;

// Buckets

// Cookie
export const COOKIE_KEY = `a_session_${PROJECT_ID}`;
