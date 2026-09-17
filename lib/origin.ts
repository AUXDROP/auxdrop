import "server-only";
import { headers } from "next/headers";

/** Best-effort request origin, for building Supabase Auth redirect URLs. */
export async function getOrigin() {
  const hdrs = await headers();
  const origin = hdrs.get("origin");
  if (origin) return origin;

  const host = hdrs.get("host") ?? "localhost:3000";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  return `${isLocal ? "http" : "https"}://${host}`;
}
