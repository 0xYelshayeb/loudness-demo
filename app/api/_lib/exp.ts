// app/api/_lib/exp.ts
import { kv } from "@vercel/kv";

export async function currentVersion(): Promise<number> {
  let v = await kv.get<number>("exp:version");
  if (!v) { v = 1; await kv.set("exp:version", v); }
  return v;
}

// Build namespaced keys so a version bump "resets" the experiment
export function k(v: number, ...parts: string[]) {
  return ["exp", String(v), ...parts].join(":");
}
