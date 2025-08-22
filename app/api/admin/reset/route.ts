// app/api/admin/reset/route.ts
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { currentVersion } from "../../_lib/exp";

const TOKEN = process.env.ADMIN_RESET_TOKEN;

export async function POST(req: Request) {
  // Accept token via Authorization: Bearer <token> or ?token=...
  const auth = req.headers.get("authorization") || "";
  const fromHeader = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  const fromQuery = new URL(req.url).searchParams.get("token");
  const token = fromHeader || fromQuery;

  if (!TOKEN || token !== TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const v = await currentVersion();
  await kv.set("exp:version", v + 1);

  // (Optional) You could try to clean old keys, but versioning alone is enough.
  return NextResponse.json({ ok: true, newVersion: v + 1 });
}
