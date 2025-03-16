import { COOKIE_KEY } from "@/lib/constants";

import { cookies } from "next/headers";

export async function GET() {
  const session = (await cookies()).get(COOKIE_KEY);

  return Response.json({
    session: session,
  });
}
