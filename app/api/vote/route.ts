// app/api/vote/route.ts
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { currentVersion, k } from "../_lib/exp"; // add

type Body = {
    test: "t1" | "t2";
    n: number;
    choice: "1" | "2" | "tie";
    mapping: { one: "Fitted" | "Lufs"; two: "Fitted" | "Lufs" }; // client sends which label was 1/2
};

export async function POST(req: Request) {

    const v = await currentVersion();
    const body = (await req.json()) as Body;

    if (!["t1", "t2"].includes(body.test) || !["1", "2", "tie"].includes(body.choice)) {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    await kv.incr(k(v, body.test, body.choice)); // global histogram
    await kv.incr(k(v, body.test, String(body.n), body.choice)); // per-item
    if (body.choice !== "tie") {
        const chosenLabel = body.choice === "1" ? body.mapping.one : body.mapping.two;
        await kv.incr(k(v, body.test, "label", chosenLabel));
    }

    return NextResponse.json({ ok: true });
}
